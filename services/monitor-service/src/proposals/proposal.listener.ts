import { NOTIFICATION_QUEUE } from '@gilder/constants';
import {
  NotificationSubscription,
  Realm,
  Proposal as DbProposal,
} from '@gilder/db-entities';
import { ProposalRPCService, ProposalsService } from '@gilder/proposals-module';
import { RealmsService } from '@gilder/realms-module';
import { InjectQueue } from '@nestjs/bull';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getProposal, getRealm, ProposalState } from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { NotificationTypes } from '@gilder/types';
import type { ProcessNewProposalData } from '@gilder/internal-types';
import { RpcManagerService } from '@gilder/rpc-manager-module';
import { PROPOSAL_CONNECTION, WS_CONNECTION } from 'src/utils/constants';
import { tryGetProposalData, tryGetRealmData } from '@gilder/utilities';

@Injectable()
export class ProposalListenerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProposalListenerService.name);

  private uniqueRealmKeys: Set<string> = new Set();

  private get realmSubscriptionIds() {
    return this._realmSubscriptionIds;
  }

  private get proposalSubscriptionIds() {
    return this._proposalSubscriptionIds;
  }

  private _realmSubscriptionIds: number[] = [];
  private _proposalSubscriptionIds: number[] = [];
  private readonly connection: Connection;
  private readonly wsConnection: Connection;

  constructor(
    @InjectQueue(NOTIFICATION_QUEUE)
    private readonly notificationQueue: Queue,
    @InjectRepository(NotificationSubscription)
    private readonly subscriptionRepo: Repository<NotificationSubscription>,
    private readonly realmsService: RealmsService,
    private readonly proposalsService: ProposalsService,
    private readonly proposalRpcService: ProposalRPCService,
    rpcManagerService: RpcManagerService,
  ) {
    this.connection = rpcManagerService.getConnection(PROPOSAL_CONNECTION);
    this.wsConnection = rpcManagerService.getConnection(WS_CONNECTION);
  }

  async onModuleInit() {
    await this.listenForProposals();
  }

  async onModuleDestroy() {
    await this.cleanUpSubscriptions();
  }

  public async listenForProposals() {
    await this.cleanUpSubscriptions();

    const subscriptions = await this.subscriptionRepo.find({
      select: ['realmPk'],
      where: {
        isActive: true,
      },
    });

    this.uniqueRealmKeys = new Set(subscriptions.map((x) => x.realmPk));

    const realms = await this.realmsService.getRealmsByRealmPubKey(
      Array.from(this.uniqueRealmKeys),
    );

    for (const realm of realms) {
      this.addRealmListener(realm);
    }
  }

  public async tryAddNewRealmListener(
    subscription: NotificationSubscription,
  ): Promise<void> {
    if (this.uniqueRealmKeys.has(subscription.realmPk)) {
      return;
    }

    this.uniqueRealmKeys.add(subscription.realmPk);
    const realm = await this.realmsService.getRealmByRealmPubKey(
      subscription.realmPk,
    );
    await this.addRealmListener(realm);
  }

  private async addRealmListener(realm: Realm) {
    const proposals = await this.proposalsService.getAllProposalsInRealm(
      realm.realmPk,
    );

    const realmProposalSubscriptions = (
      await Promise.all(
        proposals
          .filter((x) => x.state < 3)
          .map((proposal) => this.listenForProposalChanges(proposal)),
      )
    ).filter((x) => !!x);

    this.logger.log(
      `Found ${realmProposalSubscriptions.length} active proposals associated to Realm: ${realm.name}`,
    );

    this._realmSubscriptionIds.push(await this.listenForNewProposals(realm));
    this._proposalSubscriptionIds = this.proposalSubscriptionIds.concat(
      ...realmProposalSubscriptions,
    );
  }

  private async listenForProposalChanges({
    realmPk,
    proposalPk,
    programPk,
  }: Pick<DbProposal, 'realmPk' | 'proposalPk' | 'programPk'>): Promise<
    number | null
  > {
    const proposalPubKey = new PublicKey(proposalPk);
    const solanaProposal = await getProposal(this.connection, proposalPubKey);

    if (solanaProposal.account.isVoteFinalized()) {
      await this.proposalsService.addOrUpdateProposals(
        { realmPk, programPk },
        [solanaProposal],
        this.connection,
      );
      return null;
    }

    let currentState = solanaProposal.account;
    const subscriptionId = this.wsConnection.onAccountChange(
      proposalPubKey,
      async (accountInfo) => {
        const proposal = tryGetProposalData(proposalPubKey, accountInfo);

        try {
          if (currentState.state === proposal.account.state) {
            currentState = proposal.account;
            return;
          }

          this.logger.log(
            `Proposal state was changed from ${currentState.state} to ${proposal.account.state} for ${proposal.account.name}`,
          );
          currentState = proposal.account;

          if (proposal.account.isVoteFinalized()) {
            this.logger.log(
              `Voting was finalized. Removing ${proposal.account.name} listener...`,
            );
            await this.wsConnection.removeAccountChangeListener(subscriptionId);
            this._proposalSubscriptionIds = this.proposalSubscriptionIds.filter(
              (x) => x !== subscriptionId,
            );
          }
        } catch (e) {
          this.logger.error(`Something went wrong. Error: ${e}`);
        } finally {
          await this.proposalsService.addOrUpdateProposals(
            { realmPk, programPk },
            [proposal],
            this.connection,
          );
        }
      },
      'confirmed',
    );

    return subscriptionId;
  }

  private async listenForNewProposals(realm: Realm) {
    this.logger.log(`Listening to changes for Realm: ${realm.name}`);
    const realmPubKey = new PublicKey(realm.realmPk);

    const solanaRealm = await getRealm(this.connection, realmPubKey);
    let currentState = solanaRealm.account;

    return this.wsConnection.onAccountChange(
      realmPubKey,
      async (accountInfo) => {
        const newRealmData = tryGetRealmData(realmPubKey, accountInfo);
        if (
          newRealmData.account.votingProposalCount ===
          currentState.votingProposalCount
        ) {
          currentState = newRealmData.account;
          return;
        }

        currentState = newRealmData.account;

        const allProposals =
          await this.proposalRpcService.getProposalsFromSolanaByRealm(
            realm,
            this.connection,
          );

        const { found, newProposals } =
          await this.proposalsService.foundNewProposals(
            realm.realmPk,
            allProposals,
          );

        if (found) {
          this.logger.log(
            `Found ${newProposals.length} new proposals for Realm: ${realm.name}`,
          );
          try {
            // This logic is flawed due to not checking to see if proposal is in draft mode
            // cause technically it could just now be entering into cancelled or completed which is arguably
            // not "new" but will suffice for now
            await Promise.all(
              newProposals.map((p) => {
                return this.notificationQueue.add(
                  NotificationTypes.NEW_PROPOSALS,
                  {
                    proposalPk: p.pubkey.toBase58(),
                    proposalName: p.account.name,
                    realmName: realm.name,
                    realmPk: realm.realmPk,
                  } as ProcessNewProposalData,
                );
              }),
            );

            const validProposals = newProposals.filter(
              (x) => !x.account.isVoteFinalized(),
            );

            const subscriptionIds = await Promise.all(
              validProposals.map((p) =>
                this.listenForProposalChanges({
                  realmPk: realm.realmPk,
                  programPk: realm.programPk,
                  proposalPk: p.pubkey.toString(),
                }),
              ),
            );
            this.logger.log(
              `Successfully added ${subscriptionIds.length} proposal listeners...`,
            );
            this._proposalSubscriptionIds = this.proposalSubscriptionIds.concat(
              ...subscriptionIds,
            );
          } catch (e) {
            this.logger.error(
              `Something went wrong when trying to add new proposal listeners. Error: ${e}`,
            );
          } finally {
            await this.proposalsService.addOrUpdateProposals(
              realm,
              newProposals,
              this.connection,
            );
          }
        }
      },
      'confirmed',
    );
  }

  async cleanUpSubscriptions() {
    this.logger.log('Cleaning up any remaining subscriptions...');
    for (const id of this.realmSubscriptionIds) {
      await this.wsConnection.removeAccountChangeListener(id);
    }

    for (const id of this.proposalSubscriptionIds) {
      await this.wsConnection.removeAccountChangeListener(id);
    }
  }
}

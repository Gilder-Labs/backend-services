import { NOTIFICATION_QUEUE, PROPOSAL_NOTIFICATION } from '@gilder/constants';
import { NotificationSubscription, Realm } from '@gilder/db-entities';
import { ProposalRPCService, ProposalsService } from '@gilder/proposals-module';
import { RealmsService } from '@gilder/realms-module';
import { getConnection } from '@gilder/utilities';
import { InjectQueue } from '@nestjs/bull';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramAccount, Proposal } from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { Repository } from 'typeorm';
import { Queue } from 'bull';

interface ProposalWithRealm {
  proposal: ProgramAccount<Proposal>;
  realm: Realm;
}

@Injectable()
export class ProposalsMonitorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProposalsMonitorService.name);
  private connection: Connection;

  private uniqueRealmKeys: Set<string> = new Set();

  private realmSubscriptionIds: number[] = [];
  private proposalSubscriptionIds: number[] = [];

  constructor(
    @InjectQueue(NOTIFICATION_QUEUE)
    private readonly notificationQueue: Queue,
    @InjectRepository(NotificationSubscription)
    private readonly subscriptionRepo: Repository<NotificationSubscription>,
    private readonly realmsService: RealmsService,
    private readonly proposalsService: ProposalsService,
    private readonly proposalRpcService: ProposalRPCService,
  ) {
    this.connection = getConnection();
  }

  async onModuleInit() {
    await this.listenForProposals();
  }

  async onModuleDestroy() {
    await this.cleanUpSubscriptions();
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

  private async addRealmListener(realm: Realm) {
    const proposals =
      await this.proposalRpcService.getProposalsFromSolanaByRealm(realm);

    this.logger.log(
      `Found ${proposals.length} proposals associated to Realm: ${realm.name}`,
    );
    await this.proposalsService.addOrUpdateProposals(realm, proposals);

    const activeProposals = proposals
      .filter((p) => !p.account.isVoteFinalized())
      .map<ProposalWithRealm>((x) => ({ proposal: x, realm }));

    this.logger.log(
      `${activeProposals.length} proposals currently active for Realm: ${realm.name}`,
    );

    const proposalSubscriptionIds = activeProposals.map((proposal) =>
      this.listenForProposalChanges(proposal),
    );

    this.realmSubscriptionIds.push(this.listenForNewProposals(realm));
    this.proposalSubscriptionIds = this.proposalSubscriptionIds.concat(
      proposalSubscriptionIds,
    );
  }

  private listenForProposalChanges({ proposal, realm }: ProposalWithRealm) {
    let currentState = proposal.account.state;
    const subscriptionId = this.connection.onAccountChange(
      new PublicKey(proposal.pubkey),
      async () => {
        this.logger.log(
          `Detected change for proposal: ${proposal.account.name}`,
        );

        const updatedProposal =
          await this.proposalRpcService.getProposalFromSolana(
            proposal.pubkey.toBase58(),
          );
        try {
          if (currentState !== updatedProposal.account.state) {
            this.logger.log(
              `Proposal state was changed from ${currentState} to ${updatedProposal.account.state}`,
            );
            currentState = updatedProposal.account.state;
          }

          if (updatedProposal.account.isVoteFinalized()) {
            this.logger.log(
              `Voting was finalized. Removing ${updatedProposal.account.name} listener...`,
            );
            await this.connection.removeAccountChangeListener(subscriptionId);
            this.proposalSubscriptionIds = this.proposalSubscriptionIds.filter(
              (x) => x !== subscriptionId,
            );
          }
        } catch (e) {
          this.logger.error(`Something went wrong. Error: ${e}`);
        } finally {
          await this.proposalsService.addOrUpdateProposals(realm, [
            updatedProposal,
          ]);
        }
      },
      'confirmed',
    );

    return subscriptionId;
  }

  private listenForNewProposals(realm: Realm) {
    this.logger.log(`Listening to changes for Realm: ${realm.name}`);
    return this.connection.onAccountChange(
      new PublicKey(realm.realmPk),
      async () => {
        this.logger.log(`Detected change for Realm: ${realm.name}`);
        const allProposals =
          await this.proposalRpcService.getProposalsFromSolanaByRealm(realm);
        const { found, newProposals } =
          await this.proposalsService.foundNewProposals(realm, allProposals);
        if (found) {
          this.logger.log(`Found new proposals for Realm: ${realm.name}`);
          try {
            await Promise.all(
              newProposals.map((p) =>
                this.notificationQueue.add(PROPOSAL_NOTIFICATION, {
                  realm,
                  proposal: p,
                }),
              ),
            );
            const subscriptionIds = await Promise.all(
              newProposals.map((p) =>
                this.listenForProposalChanges({ proposal: p, realm }),
              ),
            );
            this.logger.log(
              `Successfully added ${subscriptionIds.length} proposal listeners...`,
            );
            this.proposalSubscriptionIds = [
              ...this.proposalSubscriptionIds,
              ...subscriptionIds,
            ];
          } catch (e) {
            this.logger.error(
              `Something went wrong when trying to add new proposal listeners. Error: ${e}`,
            );
          } finally {
            await this.proposalsService.addOrUpdateProposals(
              realm,
              newProposals,
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
      await this.connection.removeAccountChangeListener(id);
    }

    for (const id of this.proposalSubscriptionIds) {
      await this.connection.removeAccountChangeListener(id);
    }
  }
}

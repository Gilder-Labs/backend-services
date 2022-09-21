import { NotificationSubscription, Realm } from '@gilder/db-entities';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramAccount, Proposal } from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { RealmsService } from 'src/realms/realms.service';
import { getConnection } from 'src/utils';
import { Repository } from 'typeorm';
import { ProposalService } from './proposals.service';

interface ProposalWithRealm {
  proposal: ProgramAccount<Proposal>;
  realm: Realm;
}

@Injectable()
export class ProposalsMonitorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProposalsMonitorService.name);
  private connection: Connection;

  private realmSubscriptionIds: number[] = [];
  private proposalSubscriptionIds: number[] = [];

  constructor(
    @InjectRepository(NotificationSubscription)
    private readonly subscriptionRepo: Repository<NotificationSubscription>,
    private readonly realmsService: RealmsService,
    private readonly proposalService: ProposalService,
  ) {
    this.connection = getConnection();
  }

  async onModuleInit() {
    await this.listenForProposals();
  }

  async onModuleDestroy() {
    await this.cleanUpSubscriptions();
  }

  public async listenForProposals() {
    this.logger.log('Listening for proposals...');
    const subscriptions = await this.subscriptionRepo.find({
      select: ['realmPubKey'],
    });

    const realms = await this.realmsService.getRealmsByRealmPubKey(
      subscriptions.map((x) => x.realmPubKey),
    );

    let activeProposals: ProposalWithRealm[] = [];

    for (const realm of realms) {
      const proposals =
        await this.proposalService.getProposalsFromSolanaByRealm(realm);

      this.logger.log(
        `Found ${proposals.length} proposals associated to Realm: ${realm.name}`,
      );
      await this.proposalService.addOrUpdateProposals(realm, proposals);

      activeProposals = [
        ...activeProposals,
        ...proposals
          .filter((p) => !p.account.isVoteFinalized())
          .map<ProposalWithRealm>((x) => ({ proposal: x, realm })),
      ];
    }

    this.logger.log(`${activeProposals.length} proposals currently active...`);

    await this.cleanUpSubscriptions();

    this.realmSubscriptionIds = await Promise.all(
      realms.map((realm) => this.listenForNewProposals(realm)),
    );

    this.proposalSubscriptionIds = await Promise.all(
      activeProposals.map((proposal) =>
        this.listenForProposalChanges(proposal),
      ),
    );

    this.logger.log('Finished setting up listeners!');
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
          await this.proposalService.getProposalFromSolana(
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
          await this.proposalService.addOrUpdateProposals(realm, [
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
      new PublicKey(realm.pubkey),
      async () => {
        this.logger.log(`Detected change for Realm: ${realm.name}`);
        const allProposals =
          await this.proposalService.getProposalsFromSolanaByRealm(realm);
        const { found, newProposals } =
          await this.proposalService.foundNewProposals(realm, allProposals);
        if (found) {
          this.logger.log(`Found new proposals for Realm: ${realm.name}`);
          try {
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
            await this.proposalService.addOrUpdateProposals(
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

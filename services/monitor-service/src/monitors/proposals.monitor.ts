import { NotificationSubscription, Proposal, Realm } from '@gilder/db-entities';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  getAllProposals,
  getGovernance,
  Governance,
  ProposalState,
} from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { getConnection } from 'src/utils';
import { In, Repository } from 'typeorm';

@Injectable()
export class ProposalsMonitorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProposalsMonitorService.name);
  private connection: Connection;

  private subscriptionIds: number[] = [];

  constructor(
    @InjectRepository(NotificationSubscription)
    private readonly subscriptionRepo: Repository<NotificationSubscription>,
    @InjectRepository(Realm)
    private readonly realmRepo: Repository<Realm>,
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
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

    const realms = await this.realmRepo.find({
      select: ['pubkey', 'governance', 'name'],
      where: {
        pubkey: In(subscriptions.map((x) => x.realmPubKey)),
      },
    });

    for (const realm of realms) {
      await this.retrieveProposalsForRealm(realm);
    }

    await this.cleanUpSubscriptions();

    this.subscriptionIds = await Promise.all(
      realms.map((realm) => this.startRealmListener(realm)),
    );

    this.logger.log('Finished setting up listeners!');
  }

  private async retrieveProposalsForRealm(realm: Realm) {
    const proposals = await getAllProposals(
      this.connection,
      new PublicKey(realm.governance),
      new PublicKey(realm.pubkey),
    );

    const dbProposals = await Promise.all(
      proposals
        .flatMap((x) => x)
        .map<Promise<Partial<Proposal>>>(async (x) => {
          let estimatedVoteCompletionAt: number | null = null;

          if (x.account.state === ProposalState.Voting) {
            const governance = await getGovernance(
              this.connection,
              new PublicKey(x.account.governance),
            );

            if (x.account.votingAt) {
              estimatedVoteCompletionAt =
                x.account.votingAt.toNumber() +
                x.account.getTimeToVoteEnd(governance.account);
            }
          }

          return {
            governanceKey: x.account.governance.toBase58(),
            pubkey: x.pubkey.toBase58(),
            descriptionLink: x.account.descriptionLink,
            name: x.account.name,
            state: x.account.state,
            draftAt: new Date(x.account.draftAt.toNumber() * 1000),
            startVotingAt:
              x.account.startVotingAt &&
              new Date(x.account.startVotingAt.toNumber() * 1000),
            signingOffAt:
              x.account.signingOffAt &&
              new Date(x.account.signingOffAt.toNumber() * 1000),
            votingCompletedAt:
              x.account.votingCompletedAt &&
              new Date(x.account.votingCompletedAt.toNumber() * 1000),
            votingAt:
              x.account.votingAt &&
              new Date(x.account.votingAt.toNumber() * 1000),
            estimatedVoteCompletionAt:
              estimatedVoteCompletionAt &&
              new Date(estimatedVoteCompletionAt * 1000),
            closedAt:
              x.account.closedAt &&
              new Date(x.account.closedAt.toNumber() * 1000),
            executingAt:
              x.account.executingAt &&
              new Date(x.account.executingAt.toNumber() * 1000),
          };
        }),
    );

    await this.proposalRepo
      .createQueryBuilder()
      .insert()
      .into(Proposal)
      .values(dbProposals)
      .orUpdate(
        [
          'descriptionLink',
          'name',
          'state',
          'draftAt',
          'startVotingAt',
          'signingOffAt',
          'votingCompletedAt',
          'estimatedVoteCompletionAt',
          'votingAt',
          'closedAt',
          'executingAt',
        ],
        ['pubkey'],
        {
          skipUpdateIfNoValuesChanged: true,
        },
      )
      .execute();
  }

  async startRealmListener(realm: Realm) {
    this.logger.log(`Listening to changes for Realm: ${realm.name}`);
    return this.connection.onAccountChange(
      new PublicKey(realm.pubkey),
      async (accountInfo, context) => {
        this.logger.log('Something happeneed here');
        // newer.forEach((n: any) => {
        //   notifyNewProposals(
        //     realm.pubkey,
        //     realm.name,
        //     n.account.name,
        //     n.pubkey.toBase58(),
        //   );
        // });
      },
    );
  }

  async cleanUpSubscriptions() {
    this.logger.log('Cleaning up any remaining subscriptions...');
    for (const id of this.subscriptionIds) {
      await this.connection.removeAccountChangeListener(id);
    }
  }
}

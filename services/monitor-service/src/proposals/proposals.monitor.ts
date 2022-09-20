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
  ProposalState,
} from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { getConnection } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class ProposalsMonitorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProposalsMonitorService.name);
  private connection: Connection;

  private realmSubscriptionIds: number[] = [];
  private proposalSubscriptionIds: number[] = [];

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

    await this.cleanUpSubscriptions();

    // this.realmSubscriptionIds = await Promise.all(
    //   realms.map((realm) => this.startRealmListener(realm)),
    // );

    this.logger.log('Finished setting up listeners!');
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
    for (const id of this.realmSubscriptionIds) {
      await this.connection.removeAccountChangeListener(id);
    }

    for (const id of this.proposalSubscriptionIds) {
      await this.connection.removeAccountChangeListener(id);
    }
  }
}

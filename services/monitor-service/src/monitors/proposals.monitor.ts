import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { getAllProposals } from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { getConnection } from 'src/utils';

@Injectable()
export class ProposalsMonitorService implements OnModuleInit {
  private readonly logger = new Logger(ProposalsMonitorService.name);
  private connection: Connection;

  constructor() {
    this.connection = getConnection();
  }

  async onModuleInit() {
    // const realms = await this.realmRepository.find();
    await this.startRealmListener();
  }

  async startRealmListener() {
    const foo = new PublicKey('6jydyMWSqV2bFHjCHydEQxa9XfXQWDwjVqAdjBEA1BXx');
    const bar = await getAllProposals(
      this.connection,
      new PublicKey('GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw'),
      foo,
    );
    const baz = bar[1][0].account.draftAt.toNumber();
    this.logger.log(`${baz}`);
  }
}

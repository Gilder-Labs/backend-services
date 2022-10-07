import {
  GOVERNANCE_QUEUE,
  PROPOSAL_QUEUE,
  TOKEN_OWNER_QUEUE,
} from '@gilder/constants';
import { RealmsRPCService, RealmsService } from '@gilder/realms-module';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProcessRealmProposals, QueueProcessTypes } from '@gilder/types';
import { chunkArray, getConnection } from '@gilder/utilities';
import { Queue } from 'bull';

@Injectable()
export class RealmsMonitorService {
  private readonly logger = new Logger(RealmsMonitorService.name);

  constructor(
    private readonly realmsService: RealmsService,
    private readonly realmsRpcService: RealmsRPCService,
    @InjectQueue(GOVERNANCE_QUEUE)
    private readonly governanceQueue: Queue,
    @InjectQueue(PROPOSAL_QUEUE)
    private readonly proposalQueue: Queue,
    @InjectQueue(TOKEN_OWNER_QUEUE)
    private readonly tokenOwnerQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async addOrUpdateRealms() {
    const realms = await this.realmsRpcService.getAllRealmsFromSolana();
    this.logger.log(`Discovered ${realms.length} realms...`);

    const processData = realms.map<ProcessRealmProposals>((x) => ({
      realmPk: x.pubkey.toBase58(),
      programPk: x.owner.toBase58(),
    }));
    await this.realmsService.addOrUpdateRealms(realms);

    await Promise.all([
      this.addToProposalQueue(processData),
      this.addToGovernanceQueue(processData),
      this.addTokenOwnerQueue(processData),
    ]);
  }

  private async addToProposalQueue(processData: ProcessRealmProposals[]) {
    const messages = chunkArray(processData, 100).map((data) => ({
      name: QueueProcessTypes.UPDATE_PROCESS,
      data: {
        realms: data,
      },
    }));
    await this.proposalQueue.addBulk(messages);
  }

  private async addTokenOwnerQueue(processData: ProcessRealmProposals[]) {
    // const messages = processData.map((data) => ({
    //   name: QueueProcessTypes.UPDATE_PROCESS,
    //   data,
    // }));
    // await this.tokenOwnerQueue.addBulk(messages);
  }

  private async addToGovernanceQueue(processData: ProcessRealmProposals[]) {
    // const messages = processData.map((data) => ({
    //   name: QueueProcessTypes.UPDATE_PROCESS,
    //   data,
    // }));
    // await this.governanceQueue.addBulk(messages);
  }
}

import { GOVERNANCE_QUEUE, TOKEN_OWNER_QUEUE } from '@gilder/constants';
import { RealmsRPCService, RealmsService } from '@gilder/realms-module';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProcessRealmData, QueueProcessTypes } from '@gilder/internal-types';
import { chunkArray } from '@gilder/utilities';
import { Queue } from 'bull';
import { RpcManagerService } from '@gilder/rpc-manager-module';
import { Connection } from '@solana/web3.js';
import { DEFAULT_CONNECTION } from 'src/utils/constants';

@Injectable()
export class RealmsMonitorService {
  private readonly logger = new Logger(RealmsMonitorService.name);
  private readonly connection: Connection;

  constructor(
    private readonly realmsService: RealmsService,
    private readonly realmsRpcService: RealmsRPCService,
    rpcManager: RpcManagerService,
    @InjectQueue(GOVERNANCE_QUEUE)
    private readonly governanceQueue: Queue,
    @InjectQueue(TOKEN_OWNER_QUEUE)
    private readonly tokenOwnerQueue: Queue,
  ) {
    this.connection = rpcManager.getConnection(DEFAULT_CONNECTION);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async addOrUpdateRealms() {
    const realms = await this.realmsRpcService.getAllRealmsFromSolana(
      this.connection,
    );
    this.logger.log(`Discovered ${realms.length} realms...`);

    const processData = realms.map<ProcessRealmData>((x) => ({
      realmPk: x.pubkey.toBase58(),
      programPk: x.owner.toBase58(),
    }));
    await this.realmsService.addOrUpdateRealms(realms);

    await Promise.all([
      // this.addToQueue(this.proposalQueue, processData),
      // this.addToQueue(this.governanceQueue, processData),
      // this.addToQueue(this.tokenOwnerQueue, processData),
    ]);
  }

  private async addToQueue(queue: Queue, processData: ProcessRealmData[]) {
    const messages = chunkArray(processData, 100).map((data) => ({
      name: QueueProcessTypes.UPDATE_PROCESS,
      data: {
        entities: data,
      },
    }));
    await queue.addBulk(messages);
  }
}

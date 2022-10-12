import { GOVERNANCE_QUEUE } from '@gilder/constants';
import { GovernancesService } from '@gilder/governances-module';
import { RpcManagerService } from '@gilder/rpc-manager-module';
import {
  BulkProcessUpdates,
  ProcessRealmData,
  QueueProcessTypes,
} from '@gilder/types';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { getAllGovernances } from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { Job } from 'bull';
import { DEFAULT_CONNECTION } from 'src/utils/constants';

@Processor(GOVERNANCE_QUEUE)
export class GovernanceProcessor {
  private readonly logger = new Logger(GovernanceProcessor.name);
  private readonly connection: Connection;

  constructor(
    private readonly rpcManager: RpcManagerService,
    private readonly governanceService: GovernancesService,
  ) {
    this.connection = rpcManager.getConnection(DEFAULT_CONNECTION);
  }

  @Process(QueueProcessTypes.UPDATE_PROCESS)
  async processRealmGovernances(
    job: Job<BulkProcessUpdates<ProcessRealmData>>,
  ) {
    const { entities } = job.data;
    await Promise.all(
      entities.map(async ({ realmPk, programPk }) => {
        const realm = {
          realmPk: new PublicKey(realmPk),
          programPk: new PublicKey(programPk),
        };

        try {
          const governances = await getAllGovernances(
            this.connection,
            realm.programPk,
            realm.realmPk,
          );

          await this.governanceService.addOrUpdateGovernances(
            realm.realmPk.toString(),
            governances,
          );
        } catch (e) {
          this.logger.error(`Something went wrong. Error: ${e}`);
        }
      }),
    );
  }
}

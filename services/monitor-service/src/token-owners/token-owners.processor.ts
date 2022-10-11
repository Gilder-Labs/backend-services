import { TOKEN_OWNER_QUEUE } from '@gilder/constants';
import { RpcManagerService } from '@gilder/rpc-manager-module';
import { TokenOwnersService } from '@gilder/token-owners-module';
import {
  BulkProcessUpdates,
  ProcessRealmData,
  QueueProcessTypes,
} from '@gilder/types';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { getAllTokenOwnerRecords } from '@solana/spl-governance';
import { PublicKey } from '@solana/web3.js';
import { Job } from 'bull';

@Processor(TOKEN_OWNER_QUEUE)
export class TokenOwnersProcessor {
  private readonly logger = new Logger(TokenOwnersProcessor.name);

  constructor(
    private readonly rpcManager: RpcManagerService,
    private readonly tokenOwnerService: TokenOwnersService,
  ) {}

  @Process(QueueProcessTypes.UPDATE_PROCESS)
  async processRealmTokenOwners(
    job: Job<BulkProcessUpdates<ProcessRealmData>>,
  ) {
    const { entities } = job.data;
    await Promise.all(
      entities.map(async ({ realmPk, programPk }) => {
        try {
          const tokenOwners = await getAllTokenOwnerRecords(
            this.rpcManager.connection,
            new PublicKey(programPk),
            new PublicKey(realmPk),
          );
          await this.tokenOwnerService.addOrUpdateTokenOwners(
            realmPk,
            tokenOwners,
          );
        } catch (e) {
          this.logger.error(`Something went wrong. Error: ${e}`);
        }
      }),
    );
  }
}

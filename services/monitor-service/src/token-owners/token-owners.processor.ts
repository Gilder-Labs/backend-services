import { TOKEN_OWNER_QUEUE } from '@gilder/constants';
import { RpcManagerService } from '@gilder/rpc-manager-module';
import { TokenOwnersService } from '@gilder/token-owners-module';
import {
  BulkProcessUpdates,
  ProcessRealmData,
  QueueProcessTypes,
} from '@gilder/internal-types';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { getAllTokenOwnerRecords } from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { Job } from 'bull';
import { DEFAULT_CONNECTION } from 'src/utils/constants';

@Processor(TOKEN_OWNER_QUEUE)
export class TokenOwnersProcessor {
  private readonly logger = new Logger(TokenOwnersProcessor.name);
  private readonly connection: Connection;

  constructor(
    rpcManager: RpcManagerService,
    private readonly tokenOwnerService: TokenOwnersService,
  ) {
    this.connection = rpcManager.getConnection(DEFAULT_CONNECTION);
  }

  @Process(QueueProcessTypes.UPDATE_PROCESS)
  async processRealmTokenOwners(
    job: Job<BulkProcessUpdates<ProcessRealmData>>,
  ) {
    const { entities } = job.data;
    await Promise.all(
      entities.map(async ({ realmPk, programPk }) => {
        try {
          const tokenOwners = await getAllTokenOwnerRecords(
            this.connection,
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

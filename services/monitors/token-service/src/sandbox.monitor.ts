import { RpcManagerService } from '@gilder/connection-manager-module';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  ACCOUNT_SIZE,
  MINT_SIZE,
  MULTISIG_SIZE,
  TOKEN_PROGRAM_ID,
  unpackAccount,
  unpackMint,
  unpackMultisig,
} from '@solana/spl-token';
import { WS_CONNECTION } from './utils/constants';

@Injectable()
export class SandboxMonitorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SandboxMonitorService.name);

  @Inject()
  private readonly rpcManager: RpcManagerService;

  onModuleInit() {
    this.rpcManager
      .getConnection(WS_CONNECTION)
      .onProgramAccountChange(
        TOKEN_PROGRAM_ID,
        ({ accountInfo, accountId }) => {
          if (accountInfo.data.length === MULTISIG_SIZE) {
            this.logger.log(
              `MultiSig: `,
              unpackMultisig(accountId, accountInfo),
            );
          } else if (accountInfo.data.length >= ACCOUNT_SIZE) {
            // this.logger.log(`Account: `, unpackAccount(accountId, accountInfo));
          } else {
            // this.logger.log(`Mint: `, unpackMint(accountId, accountInfo));
          }
        },
      );
  }

  onModuleDestroy() {
    throw new Error('Method not implemented.');
  }
}

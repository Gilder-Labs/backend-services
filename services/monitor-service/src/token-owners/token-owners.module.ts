import { TOKEN_OWNER_QUEUE } from '@gilder/constants';
import { TokenOwner } from '@gilder/db-entities';
import { RpcManagerModule } from '@gilder/rpc-manager-module';
import { TokenOwnersServiceModule } from '@gilder/token-owners-module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenOwnersProcessor } from './token-owners.processor';

@Module({
  imports: [
    TokenOwnersServiceModule,
    RpcManagerModule.register([
      {
        rps: 100,
        uri: 'https://evocative-maximum-grass.solana-mainnet.quiknode.pro/56a0c5c00550838a2d9666ee379415ca076420f8/',
      },
      {
        rps: 25,
        uri: 'https://necessary-winter-county.solana-mainnet.discover.quiknode.pro/7ea512375c985ba68369cc9526c64a88ee27992a/',
      },
    ]),
    TypeOrmModule.forFeature([TokenOwner]),
    BullModule.registerQueue({
      name: TOKEN_OWNER_QUEUE,
    }),
  ],
  providers: [TokenOwnersProcessor],
})
export class TokenOwnersModule {}

import { TOKEN_OWNER_QUEUE } from '@gilder/constants';
import { TokenOwner } from '@gilder/db-entities';
import { RpcManagerModule } from '@gilderlabs/rpc-manager-module';
import { TokenOwnersServiceModule } from '@gilder/token-owners-module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenOwnersProcessor } from './token-owners.processor';

@Module({
  imports: [
    TokenOwnersServiceModule,
    TypeOrmModule.forFeature([TokenOwner]),
    BullModule.registerQueue({
      name: TOKEN_OWNER_QUEUE,
    }),
  ],
  providers: [TokenOwnersProcessor],
})
export class TokenOwnersModule {}

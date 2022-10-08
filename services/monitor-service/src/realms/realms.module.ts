import {
  GOVERNANCE_QUEUE,
  PROPOSAL_QUEUE,
  TOKEN_OWNER_QUEUE,
} from '@gilder/constants';
import { Realm } from '@gilder/db-entities';
import { RealmsModule } from '@gilder/realms-module';
import { RpcManagerModule } from '@gilder/rpc-manager-module';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsMonitorService } from './realms.monitor';

@Module({
  imports: [
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
    HttpModule,
    RealmsModule,
    TypeOrmModule.forFeature([Realm]),
    BullModule.registerQueue(
      { name: GOVERNANCE_QUEUE },
      { name: PROPOSAL_QUEUE },
      { name: TOKEN_OWNER_QUEUE },
    ),
  ],
  providers: [RealmsMonitorService],
})
export class RealmsMonitorModule {}

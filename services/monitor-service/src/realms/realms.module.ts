import {
  GOVERNANCE_QUEUE,
  PROPOSAL_QUEUE,
  TOKEN_OWNER_QUEUE,
} from '@gilder/constants';
import { Realm } from '@gilder/gov-db-entities';
import { RealmsModule } from '@gilder/realms-module';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsMonitorService } from './realms.monitor';

@Module({
  imports: [
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

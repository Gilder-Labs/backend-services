import { GOVERNANCE_QUEUE } from '@gilder/constants';
import { Governance } from '@gilder/db-entities';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernanceProcessor } from './governances.processor';
import { GovernancesServiceModule } from '@gilder/governances-module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Governance]),
    BullModule.registerQueue({
      name: GOVERNANCE_QUEUE,
    }),
    GovernancesServiceModule,
  ],
  providers: [GovernanceProcessor],
})
export class GovernanceModule {}

import { GOVERNANCE_QUEUE } from '@gilder/constants';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernanceProcessor } from './governances.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    BullModule.registerQueue({
      name: GOVERNANCE_QUEUE,
    }),
  ],
  providers: [GovernanceProcessor],
})
export class GovernanceModule {}

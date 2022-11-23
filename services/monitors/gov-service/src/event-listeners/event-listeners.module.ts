import { NOTIFICATION_QUEUE } from '@gilder/constants';
import { GovServiceModule } from '@gilder/gov-service-module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ProposalEventListener } from './proposal.listener';

@Module({
  imports: [
    GovServiceModule,
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
    }),
  ],
  providers: [ProposalEventListener],
})
export class EventListenersModule {}

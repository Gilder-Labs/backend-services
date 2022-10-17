import { NotificationSubscription, Proposal, Realm } from '@gilder/db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsModule } from '@gilder/realms-module';
import { ProposalController } from './proposal.controller';
import { ProposalsMonitorService } from './proposals.monitor';
import { ProposalsModule } from '@gilder/proposals-module';
import { BullModule } from '@nestjs/bull';
import { NOTIFICATION_QUEUE, PROPOSAL_QUEUE } from '@gilder/constants';
import { ProposalProcessor } from './proposal.processor';
import { ProposalListenerService } from './proposal.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Realm, Proposal, NotificationSubscription]),
    BullModule.registerQueue(
      {
        name: NOTIFICATION_QUEUE,
      },
      {
        name: PROPOSAL_QUEUE,
      },
    ),
    RealmsModule,
    ProposalsModule,
  ],
  controllers: [ProposalController],
  providers: [
    ProposalListenerService,
    ProposalsMonitorService,
    ProposalProcessor,
  ],
})
export class ProposalsMonitorModule {}

import { NotificationSubscription, Proposal, Realm } from '@gilder/db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyModule } from 'src/notify';
import { RealmsModule } from 'src/realms';
import { ProposalController } from './proposal.controller';
import { ProposalsMonitorService } from './proposals.monitor';
import { ProposalService } from './proposals.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Realm, Proposal, NotificationSubscription]),
    RealmsModule,
    NotifyModule,
  ],
  controllers: [ProposalController],
  providers: [ProposalService, ProposalsMonitorService],
  exports: [ProposalService],
})
export class ProposalsModule {}

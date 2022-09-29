import { NotificationSubscription, Proposal, Realm } from '@gilder/db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyModule } from 'src/notify';
import { RealmsModule } from '@gilder/realms-module';
import { ProposalController } from './proposal.controller';
import { ProposalsMonitorService } from './proposals.monitor';
import { ProposalsModule } from '@gilder/proposals-module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Realm, Proposal, NotificationSubscription]),
    RealmsModule,
    ProposalsModule,
    NotifyModule,
  ],
  controllers: [ProposalController],
  providers: [ProposalsMonitorService],
  exports: [],
})
export class ProposalsMonitorModule {}

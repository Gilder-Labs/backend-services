import { NotificationSubscription, Proposal, Realm } from '@gilder/db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsModule } from 'src/realms';
import { ProposalsMonitorService } from './proposals.monitor';
import { ProposalService } from './proposals.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Realm, Proposal, NotificationSubscription]),
    RealmsModule,
  ],
  controllers: [],
  providers: [ProposalService, ProposalsMonitorService],
  exports: [ProposalService],
})
export class ProposalsModule {}

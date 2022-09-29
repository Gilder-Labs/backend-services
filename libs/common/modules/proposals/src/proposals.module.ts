import { Proposal } from '@gilder/db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalRPCService } from './proposal.rpc-service';
import { ProposalsService } from './proposals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal])],
  providers: [ProposalRPCService, ProposalsService],
  exports: [ProposalRPCService, ProposalsService],
})
export class ProposalsModule {}

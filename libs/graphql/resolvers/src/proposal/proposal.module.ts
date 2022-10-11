import { Module } from '@nestjs/common';
import { ProposalsResolver } from './proposal.resolver';
import { Proposal } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProposalRPCService,
  ProposalsModule,
  ProposalsService,
} from '@gilder/proposals-module';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal]), ProposalsModule],
  providers: [ProposalsService, ProposalRPCService, ProposalsResolver],
  exports: [ProposalsResolver],
})
export class ProposalsGraphQLModule {}

import { Module } from '@nestjs/common';
import { ProposalsResolver } from './proposal.resolver';
import { Proposal } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalsModule, ProposalsService } from '@gilder/proposals-module';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal]), ProposalsModule],
  providers: [ProposalsService, ProposalsResolver],
  exports: [ProposalsResolver],
})
export class ProposalsGraphQLModule {}

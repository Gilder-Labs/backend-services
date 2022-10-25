import { Module } from '@nestjs/common';
import { ProposalsResolver } from './proposal.resolver';
import { Proposal } from '@gilder/gov-db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GovServiceModule,
  ProposalRPCService,
  ProposalsService,
} from '@gilder/gov-service-module';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal]), GovServiceModule],
  providers: [ProposalsService, ProposalRPCService, ProposalsResolver],
  exports: [ProposalsResolver],
})
export class ProposalsGraphQLModule {}

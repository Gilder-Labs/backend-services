import { Module } from '@nestjs/common';
import { RealmsResolver } from './realm/realm.resolver';
import { ProposalsResolver } from './proposal/proposal.resolver';
import { GovernanceProgramResolver } from './governance-program/governance-program.resolver';
import { TokenOwnersResolver } from './token-owners/token-owners.resolver';
import { GovernancesResolver } from './governance/governance.resolver';
import { GovernanceProgramsGraphQLModule } from './governance-program';
import { GovernancesGraphQLModule } from './governance';
import { ProposalsGraphQLModule } from './proposal';
import { RealmsGraphQLModule } from './realm';
import { TokenOwnersGraphQLModule } from './token-owners';
import { GovServiceModule } from '@gilder/gov-service-module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Realm,
  Governance,
  Proposal,
  TokenOwner,
  VoteRecord,
  SignatoryRecord,
  ProposalTransaction,
  ProgramMetadata,
} from '@gilder/gov-db-entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Realm,
      Governance,
      Proposal,
      TokenOwner,
      VoteRecord,
      SignatoryRecord,
      ProposalTransaction,
      ProgramMetadata,
    ]),
    GovServiceModule,
    GovernancesGraphQLModule,
    GovernanceProgramsGraphQLModule,
    ProposalsGraphQLModule,
    RealmsGraphQLModule,
    TokenOwnersGraphQLModule,
  ],
  providers: [
    RealmsResolver,
    ProposalsResolver,
    GovernanceProgramResolver,
    TokenOwnersResolver,
    GovernancesResolver,
  ],
  exports: [
    RealmsResolver,
    ProposalsResolver,
    GovernanceProgramResolver,
    TokenOwnersResolver,
    GovernancesResolver,
  ],
})
export class GovResolversModule {}

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
} from '@gilder/gov-db-entities';
import { ProposalTransactionsGraphQLModule } from './proposal-transaction';
import { SignatoryRecordsGraphQLModule } from './signatory-record';
import { VoteRecordsGraphQLModule } from './vote-record';
import { ProposalTransactionResolver } from './proposal-transaction/proposal-transaction.resolver';
import { SignatoryRecordResolver } from './signatory-record/signatory-record.resolver';
import { VoteRecordResolver } from './vote-record/vote-record.resolver';

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
    ]),
    GovServiceModule,
    GovernancesGraphQLModule,
    GovernanceProgramsGraphQLModule,
    ProposalsGraphQLModule,
    RealmsGraphQLModule,
    TokenOwnersGraphQLModule,
    ProposalTransactionsGraphQLModule,
    SignatoryRecordsGraphQLModule,
    VoteRecordsGraphQLModule,
  ],
  providers: [
    RealmsResolver,
    ProposalsResolver,
    GovernanceProgramResolver,
    TokenOwnersResolver,
    GovernancesResolver,
    ProposalTransactionResolver,
    SignatoryRecordResolver,
    VoteRecordResolver,
  ],
  exports: [
    RealmsResolver,
    ProposalsResolver,
    GovernanceProgramResolver,
    TokenOwnersResolver,
    GovernancesResolver,
    ProposalTransactionResolver,
    SignatoryRecordResolver,
    VoteRecordResolver,
  ],
})
export class GovResolversModule {}

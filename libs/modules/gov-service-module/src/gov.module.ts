import { ProposalsService, ProposalsServiceModule } from './proposals';
import { Module } from '@nestjs/common';
import {
  RealmsRestService,
  RealmsService,
  RealmsServiceModule,
} from './realms';
import { TokenOwnersService, TokenOwnersServiceModule } from './token-owners';
import { GovernancesService, GovernancesServiceModule } from './governances';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Governance,
  ProgramMetadata,
  Proposal,
  ProposalTransaction,
  Realm,
  SignatoryRecord,
  TokenOwner,
  VoteRecord,
} from '@gilder/gov-db-entities';
import { HttpModule } from '@nestjs/axios';
import {
  ProposalTransactionsService,
  ProposalTransactionsServiceModule,
} from './proposal-transactions';
import {
  SignatoryRecordsService,
  SignatoryRecordsServiceModule,
} from './signatory-records';
import { VoteRecordsService, VoteRecordsServiceModule } from './vote-records';
import {
  ProgramMetadataService,
  ProgramMetadataServiceModule,
} from './program-metadata';

@Module({
  imports: [
    HttpModule,
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
    GovernancesServiceModule,
    ProposalsServiceModule,
    RealmsServiceModule,
    TokenOwnersServiceModule,
    ProposalTransactionsServiceModule,
    SignatoryRecordsServiceModule,
    VoteRecordsServiceModule,
    ProgramMetadataServiceModule,
  ],
  providers: [
    RealmsService,
    RealmsRestService,
    TokenOwnersService,
    ProposalsService,
    GovernancesService,
    ProposalTransactionsService,
    SignatoryRecordsService,
    VoteRecordsService,
    ProgramMetadataService,
  ],
  exports: [
    RealmsRestService,
    RealmsService,
    TokenOwnersService,
    ProposalsService,
    GovernancesService,
    ProposalTransactionsService,
    SignatoryRecordsService,
    VoteRecordsService,
    ProgramMetadataService,
  ],
})
export class GovServiceModule {}

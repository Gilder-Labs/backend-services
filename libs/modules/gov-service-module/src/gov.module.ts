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
  ],
  providers: [
    RealmsService,
    RealmsRestService,
    TokenOwnersService,
    ProposalsService,
    GovernancesService,
  ],
  exports: [
    RealmsRestService,
    RealmsService,
    TokenOwnersService,
    ProposalsService,
    GovernancesService,
  ],
})
export class GovServiceModule {}

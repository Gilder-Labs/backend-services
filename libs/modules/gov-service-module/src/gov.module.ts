import { ProposalsService, ProposalsServiceModule } from './proposals';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  RealmsRestService,
  RealmsService,
  RealmsServiceModule,
} from './realms';
import { TokenOwnersService, TokenOwnersServiceModule } from './token-owners';
import { GovernancesService, GovernancesServiceModule } from './governances';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import {
  Governance,
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
    ]),
    GovernancesServiceModule,
    ProposalsServiceModule,
    RealmsServiceModule,
    TokenOwnersServiceModule,
    ProposalTransactionsServiceModule,
    SignatoryRecordsServiceModule,
    VoteRecordsServiceModule,
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
  ],
})
export class GovServiceModule {
  static register(dataSource?: string): DynamicModule {
    const providers: Provider<any>[] = [
      {
        provide: VoteRecordsService,
        useFactory: (repo) => new VoteRecordsService(repo),
        inject: [getRepositoryToken(VoteRecord, dataSource)],
      },
      {
        provide: TokenOwnersService,
        useFactory: (repo) => new TokenOwnersService(repo),
        inject: [getRepositoryToken(TokenOwner, dataSource)],
      },
      {
        provide: SignatoryRecordsService,
        useFactory: (repo) => new SignatoryRecordsService(repo),
        inject: [getRepositoryToken(SignatoryRecord, dataSource)],
      },
      {
        provide: RealmsService,
        useFactory: (repo) => new RealmsService(repo),
        inject: [getRepositoryToken(Realm, dataSource)],
      },
      {
        provide: ProposalsService,
        useFactory: (repo) => new ProposalsService(repo),
        inject: [getRepositoryToken(Proposal, dataSource)],
      },
      {
        provide: GovernancesService,
        useFactory: (repo) => new GovernancesService(repo),
        inject: [getRepositoryToken(Governance, dataSource)],
      },
      {
        provide: ProposalTransactionsService,
        useFactory: (repo) => new ProposalTransactionsService(repo),
        inject: [getRepositoryToken(ProposalTransaction, dataSource)],
      },
    ];

    return {
      module: GovServiceModule,
      imports: [
        HttpModule,
        TypeOrmModule.forFeature(
          [
            Realm,
            Governance,
            Proposal,
            TokenOwner,
            VoteRecord,
            SignatoryRecord,
            ProposalTransaction,
          ],
          dataSource,
        ),
      ],
      providers: providers,
      exports: providers,
    };
  }
}

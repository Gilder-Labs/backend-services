import {
  GovernancesService,
  ProposalsService,
  ProposalTransactionsService,
  RealmsService,
  SignatoryRecordsService,
  TokenOwnersService,
  VoteRecordsService,
} from '@gilder/gov-service-module';
import {
  Governance,
  Proposal,
  ProposalOption,
  ProposalTransaction,
  RawMintMaxVoteWeightSource,
  Realm,
  SignatoryRecord,
  TokenOwner,
  VoteRecord,
  VoteType,
} from '@gilder/types';
import { Inject, Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import type { IDataLoaders } from './types';

@Injectable()
export class DataLoaderService {
  @Inject(TokenOwnersService)
  private tokenOwnerService!: TokenOwnersService;

  @Inject(ProposalsService)
  private proposalsService!: ProposalsService;

  @Inject(GovernancesService)
  private governancesService!: GovernancesService;

  @Inject(RealmsService)
  private realmService!: RealmsService;

  @Inject(ProposalTransactionsService)
  private proposalTransactionService!: ProposalTransactionsService;

  @Inject(SignatoryRecordsService)
  private signatoryRecordsService!: SignatoryRecordsService;

  @Inject(VoteRecordsService)
  private voteRecordsService!: VoteRecordsService;

  getLoaders(): IDataLoaders {
    return {
      getRealmsByProgramPk: new DataLoader<
        string,
        Realm<string, string, RawMintMaxVoteWeightSource<string>>[]
      >((keys) => this.realmService.getByBatch('programPk', keys)),
      getRealmsByRealmPk: new DataLoader<
        string,
        Realm<string, string, RawMintMaxVoteWeightSource<string>>[]
      >((keys) => this.realmService.getByBatch('realmPk', keys)),
      getProposalsByProgramPk: new DataLoader<
        string,
        Proposal<string, string, VoteType, ProposalOption<string>>[]
      >((keys) => this.proposalsService.getByBatch('programPk', keys)),
      getProposalsByRealmPk: new DataLoader<
        string,
        Proposal<string, string, VoteType, ProposalOption<string>>[]
      >((keys) => this.proposalsService.getByBatch('realmPk', keys)),
      getProposalsByGovernancePk: new DataLoader<
        string,
        Proposal<string, string, VoteType, ProposalOption<string>>[]
      >((keys) => this.proposalsService.getByBatch('governancePk', keys)),
      getGovernancesByProgramPk: new DataLoader<
        string,
        Governance<string, string>[]
      >((keys) => this.governancesService.getByBatch('programPk', keys)),
      getGovernancesByRealmPk: new DataLoader<
        string,
        Governance<string, string>[]
      >((keys) => this.governancesService.getByBatch('realmPk', keys)),
      getTokenOwnersByProgramPk: new DataLoader<
        string,
        TokenOwner<string, string>[]
      >((keys) => this.tokenOwnerService.getByBatch('programPk', keys)),
      getTokenOwnersByRealmPk: new DataLoader<
        string,
        TokenOwner<string, string>[]
      >((keys) => this.tokenOwnerService.getByBatch('realmPk', keys)),
      getProposalTransactionsByProgramPk: new DataLoader<
        string,
        ProposalTransaction<string, string>[]
      >((keys) =>
        this.proposalTransactionService.getByBatch('programPk', keys),
      ),
      getSignatoryRecordByProgramPk: new DataLoader<
        string,
        SignatoryRecord<string>[]
      >((keys) => this.signatoryRecordsService.getByBatch('programPk', keys)),
      getVoteRecordsByProgramPk: new DataLoader<
        string,
        VoteRecord<string, string>[]
      >((keys) => this.voteRecordsService.getByBatch('programPk', keys)),
    };
  }
}

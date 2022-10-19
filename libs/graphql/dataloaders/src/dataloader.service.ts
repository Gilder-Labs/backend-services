import { GovernancesService } from '@gilder/governances-module';
import { ProposalsService } from '@gilder/proposals-module';
import { TokenOwnersService } from '@gilder/token-owners-module';
import { Governance, Proposal, TokenOwner } from '@gilder/types';
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

  getLoaders(): IDataLoaders {
    const tokenOwnersLoader = this._createTokenOwnersLoader();
    const proposalsLoader = this._createProposalsLoader();
    const governancesLoader = this._createGovernancesLoader();
    return {
      tokenOwnersLoader,
      proposalsLoader,
      governancesLoader,
    };
  }

  private _createTokenOwnersLoader() {
    return new DataLoader<string, TokenOwner<string, string>[]>(
      (keys: readonly string[]) =>
        this.tokenOwnerService.getRealmTokenOwnersByBatch(keys),
    );
  }

  private _createProposalsLoader() {
    return new DataLoader<string, Proposal<string>[]>(
      (keys: readonly string[]) =>
        this.proposalsService.getRealmProposalsByBatch(keys),
    );
  }

  private _createGovernancesLoader() {
    return new DataLoader<string, Governance<string, string>[]>(
      (keys: readonly string[]) =>
        this.governancesService.getRealmGovernancesByBatch(keys),
    );
  }
}

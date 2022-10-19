import DataLoader from 'dataloader';
import type { Proposal, TokenOwner, Governance } from '@gilder/types';

export interface IDataLoaders {
  tokenOwnersLoader: DataLoader<string, TokenOwner<string, string>[]>;
  proposalsLoader: DataLoader<string, Proposal<string>[]>;
  governancesLoader: DataLoader<string, Governance<string, string>[]>;
}

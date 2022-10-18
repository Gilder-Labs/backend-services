import DataLoader from 'dataloader';
import type { Proposal, TokenOwner } from '@gilder/types';

export interface IDataLoaders {
  tokenOwnersLoader: DataLoader<string, TokenOwner<string, string>[]>;
  proposalsLoader: DataLoader<string, Proposal<string>[]>;
}

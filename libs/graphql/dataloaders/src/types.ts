import DataLoader from 'dataloader';
import type { Proposal, TokenOwner, Governance, Realm } from '@gilder/types';

export interface IDataLoaders {
  realmsLoader: DataLoader<string, Realm<string>[]>;
  tokenOwnersLoader: DataLoader<string, TokenOwner<string, string>[]>;
  proposalsLoader: DataLoader<string, Proposal<string>[]>;
  governancesLoader: DataLoader<string, Governance<string, string>[]>;
}

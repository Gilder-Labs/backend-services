import DataLoader from 'dataloader';
import type {
  Proposal,
  TokenOwner,
  Governance,
  Realm,
  ProposalTransaction,
  VoteRecord,
  SignatoryRecord,
  RawMintMaxVoteWeightSource,
} from '@gilder/types';

export interface IDataLoaders {
  getRealmsByProgramPk: DataLoader<
    string,
    Realm<string, string, RawMintMaxVoteWeightSource<string>>[]
  >;
  getRealmsByRealmPk: DataLoader<
    string,
    Realm<string, string, RawMintMaxVoteWeightSource<string>>[]
  >;

  getProposalsByProgramPk: DataLoader<string, Proposal<string>[]>;
  getProposalsByRealmPk: DataLoader<string, Proposal<string>[]>;
  getProposalsByGovernancePk: DataLoader<string, Proposal<string>[]>;

  getGovernancesByProgramPk: DataLoader<string, Governance<string, string>[]>;
  getGovernancesByRealmPk: DataLoader<string, Governance<string, string>[]>;

  getTokenOwnersByProgramPk: DataLoader<string, TokenOwner<string, string>[]>;
  getTokenOwnersByRealmPk: DataLoader<string, TokenOwner<string, string>[]>;
  getProposalTransactionsByProgramPk: DataLoader<
    string,
    ProposalTransaction<string, string>[]
  >;
  getVoteRecordsByProgramPk: DataLoader<string, VoteRecord<string, string>[]>;
  getSignatoryRecordByProgramPk: DataLoader<string, SignatoryRecord<string>[]>;
}

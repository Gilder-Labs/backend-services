import { GovernanceAccountType } from '@solana/spl-governance';
import { AccountType } from './types';

const isGovernance = (type: GovernanceAccountType) => {
  return [
    GovernanceAccountType.GovernanceV1,
    GovernanceAccountType.GovernanceV2,
    GovernanceAccountType.MintGovernanceV1,
    GovernanceAccountType.MintGovernanceV2,
    GovernanceAccountType.ProgramGovernanceV1,
    GovernanceAccountType.ProgramGovernanceV2,
    GovernanceAccountType.TokenGovernanceV1,
    GovernanceAccountType.TokenGovernanceV2,
  ].includes(type);
};

const isProposal = (type: GovernanceAccountType) => {
  return [
    GovernanceAccountType.ProposalV1,
    GovernanceAccountType.ProposalV2,
  ].includes(type);
};

const isRealm = (type: GovernanceAccountType) => {
  return [
    GovernanceAccountType.RealmV1,
    GovernanceAccountType.RealmV2,
  ].includes(type);
};

const isTokenOwner = (type: GovernanceAccountType) => {
  return [
    GovernanceAccountType.TokenOwnerRecordV1,
    GovernanceAccountType.TokenOwnerRecordV2,
  ].includes(type);
};

const isProposalTransaction = (type: GovernanceAccountType) => {
  return [GovernanceAccountType.ProposalTransactionV2].includes(type);
};

const isVoteRecord = (type: GovernanceAccountType) => {
  return [
    GovernanceAccountType.VoteRecordV1,
    GovernanceAccountType.VoteRecordV2,
  ].includes(type);
};

const isRealmConfig = (type: GovernanceAccountType) => {
  return [GovernanceAccountType.RealmConfig].includes(type);
};

const isSignatoryRecord = (type: GovernanceAccountType) => {
  return [
    GovernanceAccountType.SignatoryRecordV1,
    GovernanceAccountType.SignatoryRecordV2,
  ].includes(type);
};

const isProgramMetadata = (type: GovernanceAccountType) => {
  return [GovernanceAccountType.ProgramMetadata].includes(type);
};

const getAccountType = (type?: GovernanceAccountType): AccountType | null => {
  if (!type) return null;
  if (isRealm(type)) return 'realm';
  if (isGovernance(type)) return 'governance';
  if (isTokenOwner(type)) return 'token-owner';
  if (isProposal(type)) return 'proposal';
  if (isProgramMetadata(type)) return 'program-metadata';
  if (isRealmConfig(type)) return 'realm-config';
  if (isVoteRecord(type)) return 'vote-record';
  if (isProposalTransaction(type)) return 'proposal-transaction';
  if (isSignatoryRecord(type)) return 'signatory-record';
  return null;
};

export {
  isProgramMetadata,
  isRealmConfig,
  isSignatoryRecord,
  isVoteRecord,
  isProposalTransaction,
  isGovernance,
  isProposal,
  isRealm,
  isTokenOwner,
  getAccountType,
};

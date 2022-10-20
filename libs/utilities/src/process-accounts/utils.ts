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

const getAccountType = (type?: GovernanceAccountType): AccountType | null => {
  if (!type) return null;
  if (isRealm(type)) return 'realm';
  if (isGovernance(type)) return 'governance';
  if (isTokenOwner(type)) return 'token-owner';
  if (isProposal(type)) return 'proposal';
  return null;
};

export { isGovernance, isProposal, isRealm, isTokenOwner, getAccountType };

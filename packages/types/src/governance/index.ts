import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface GovernanceConfig<TNum = BN> {
  communityVoteThreshold: VoteThreshold;
  minCommunityTokensToCreateProposal: TNum;
  minInstructionHoldUpTime: number;
  maxVotingTime: number;
  communityVoteTipping: number;
  minCouncilTokensToCreateProposal: TNum;
  councilVoteThreshold: VoteThreshold;
  councilVetoVoteThreshold: VoteThreshold;
  communityVetoVoteThreshold: VoteThreshold;
  councilVoteTipping: number;
}

export interface VoteThreshold {
  type: number;
  value?: number;
}

export interface Governance<TKey = PublicKey, TNum = BN> {
  governancePk: TKey;
  accountType: number;
  programPk: TKey;
  realmPk: TKey;
  governedAccountPk: TKey;
  config: GovernanceConfig<TNum>;
  proposalCount: number;
  votingProposalCount: number;
  isProgramGovernance: boolean;
  isAccountGovernance: boolean;
  isMintGovernance: boolean;
  isTokenGovernance: boolean;
}

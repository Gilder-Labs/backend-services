import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface Governance<TKey = PublicKey> {
  governancePk: TKey;
  accountType: number;
  realmPk: TKey;
  governedAccountPk: TKey;
  config: GovernanceConfig;
  proposalCount: number;
  votingProposalCount: number;
  isProgramGovernance: boolean;
  isAccountGovernance: boolean;
  isMintGovernance: boolean;
  isTokenGovernance: boolean;
}

export interface GovernanceConfig {
  communityVoteThreshold: VoteThreshold;
  minCommunityTokensToCreateProposal: BN;
  minInstructionHoldUpTime: number;
  maxVotingTime: number;
  communityVoteTipping: number;
  minCouncilTokensToCreateProposal: BN;
  councilVoteThreshold: VoteThreshold;
  councilVetoVoteThreshold: VoteThreshold;
  communityVetoVoteThreshold: VoteThreshold;
  councilVoteTipping: number;
}

export interface VoteThreshold {
  type: number;
  value?: number;
}

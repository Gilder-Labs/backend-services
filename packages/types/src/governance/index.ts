import { PublicKey } from '@solana/web3.js';

export interface Governance {
  governancePk: PublicKey;
  accountType: number;
  realmPk: PublicKey;
  governedAccountPk: PublicKey;
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
  minCommunityTokensToCreateProposal: number;
  minInstructionHoldUpTime: number;
  maxVotingTime: number;
  communityVoteTipping: number;
  minCouncilTokensToCreateProposal: number;
  councilVoteThreshold: VoteThreshold;
  councilVetoThreshold: VoteThreshold;
  communityVetoVoteThreshold: VoteThreshold;
  councilVoteTipping: number;
}

export interface VoteThreshold {
  type: number;
  value?: number;
}

export interface Governance {
  governancePk: string;
  accountType: number;
  realmPk: string;
  governedAccountPk: string;
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

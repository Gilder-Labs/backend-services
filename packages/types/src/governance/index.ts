import { GovernanceAccountType } from '@solana/spl-governance';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { VoteThreshold } from '../common';

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

export interface Governance<TKey = PublicKey, TNum = BN> {
  governancePk: TKey;
  accountType: GovernanceAccountType;
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

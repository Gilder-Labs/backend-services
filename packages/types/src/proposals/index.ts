import {
  InstructionExecutionFlags,
  ProposalState,
  VoteTypeKind,
  OptionVoteResult,
  GovernanceAccountType,
  VoteType as SolanaVoteType,
  ProposalOption as SolanaProposalOption,
} from '@solana/spl-governance';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { VoteThreshold } from '../common';

export interface VoteType {
  type: VoteTypeKind;
  choiceCount?: number;
}

export interface ProposalOption<TNum = BN> {
  label: string;
  voteWeight: TNum;
  voteResult: OptionVoteResult;
  instructionsExecutedCount: number;
  instructionsCount: number;
  instructionsNextIndex: number;
}

export interface Proposal<
  TKey = PublicKey,
  TNum = BN,
  TVote = SolanaVoteType,
  TOption = SolanaProposalOption,
> {
  accountType: GovernanceAccountType;
  programPk: TKey;
  proposalPk: TKey;
  governancePk: TKey;
  governingTokenMintPk: TKey;
  realmPk: TKey;
  name: string;
  state: ProposalState;
  descriptionLink?: string;
  draftAt: Date;
  signingOffAt?: Date;
  startVotingAt?: Date;
  votingCompletedAt?: Date;
  votingAt?: Date;
  estimatedVoteCompletionAt?: Date;
  closedAt?: Date;
  executingAt?: Date;
  tokenOwnerRecordPk: TKey;
  signatoriesCount?: number;
  signatoriesSignedOffCount?: number;
  instructionsExecutedCount?: number;
  instructionsCount?: number;
  instructionsNextIndex?: number;
  voteType?: TVote;
  options?: TOption[];
  denyVoteWeight?: TNum;
  abstainVoteWeight?: TNum;
  maxVotingTime?: number;
  votingAtSlot?: TNum;
  executionFlags: InstructionExecutionFlags;
  maxVoteWeight?: TNum;
  voteThreshold?: VoteThreshold;
  vetoVoteWeight?: TNum;
  isVoteFinalized: boolean;
  isFinalState: boolean;
  stateTimestamp: Date;
  stateSortRank: number;
  isPreVotingState: boolean;
  yesVoteOption?: TOption;
  yesVoteCount: TNum;
  noVoteCount: TNum;
  timeToVoteEnd: number;
  voteTimeEnded: boolean;
}

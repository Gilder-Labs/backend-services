import {
  InstructionExecutionFlags,
  ProposalState,
  VoteTypeKind,
  OptionVoteResult,
  GovernanceAccountType,
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

export interface Proposal<TKey = PublicKey, TNum = BN> {
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
  signatoriesCount: number;
  signatoriesSignedOffCount: number;
  instructionsExecutedCount: number;
  instructionsCount: number;
  instructionsNextIndex: number;
  voteType: VoteType;
  options: ProposalOption<TNum>[];
  denyVoteWeight?: TNum;
  abstainVoteWeight?: TNum;
  maxVotingTime?: number;
  votingAtSlot?: TNum;
  executionFlags: InstructionExecutionFlags;
  maxVoteWeight?: TNum;
  voteThreshold: VoteThreshold;
  vetoVoteWeight: TNum;
  isVoteFinalized: boolean;
  isFinalState: boolean;
  stateTimestamp: Date;
  stateSortRank: number;
  isPreVotingState: boolean;
  yesVoteOption: ProposalOption<TNum>;
  yesVoteCount: TNum;
  noVoteCount: TNum;
  timeToVoteEnd: number;
  voteTimeEnded: boolean;
}

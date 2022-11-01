import { Field, Int, ObjectType } from '@nestjs/graphql';
import type {
  Proposal as IProposal,
  VoteType as IVoteType,
  ProposalOption as IProposalOption,
} from '@gilder/types';
import {
  GovernanceAccountType,
  InstructionExecutionFlags,
  OptionVoteResult,
  VoteTypeKind,
} from '@solana/spl-governance';
import { VoteThreshold } from './governance.model';

@ObjectType()
export class VoteType implements IVoteType {
  @Field(() => Int)
  type: VoteTypeKind;
  @Field(() => Int, { nullable: true })
  choiceCount?: number;
}

@ObjectType()
export class ProposalOption implements IProposalOption<string> {
  @Field()
  label: string;

  @Field()
  voteWeight: string;

  @Field(() => Int)
  voteResult: OptionVoteResult;

  @Field(() => Int)
  instructionsExecutedCount: number;

  @Field(() => Int)
  instructionsCount: number;

  @Field(() => Int)
  instructionsNextIndex: number;
}

@ObjectType()
export class Proposal
  implements IProposal<string, string, VoteType, ProposalOption>
{
  @Field(() => Int)
  accountType: GovernanceAccountType;

  @Field()
  governingTokenMintPk: string;

  @Field()
  governancePk: string;

  @Field()
  proposalPk: string;

  @Field()
  programPk: string;

  @Field()
  realmPk: string;

  @Field()
  name: string;

  @Field()
  tokenOwnerRecordPk: string;

  @Field(() => Int, { nullable: true })
  signatoriesCount?: number;

  @Field(() => Int, { nullable: true })
  signatoriesSignedOffCount?: number;

  @Field(() => Int, { nullable: true })
  instructionsExecutedCount?: number;

  @Field(() => Int, { nullable: true })
  instructionsCount?: number;

  @Field(() => Int, { nullable: true })
  instructionsNextIndex?: number;

  @Field(() => VoteType, { nullable: true })
  voteType?: VoteType;

  @Field(() => [ProposalOption], { nullable: true })
  options?: ProposalOption[];

  @Field({ nullable: true })
  denyVoteWeight?: string;

  @Field({ nullable: true })
  abstainVoteWeight?: string;

  @Field(() => Int, { nullable: true })
  maxVotingTime?: number;

  @Field({ nullable: true })
  votingAtSlot?: string;

  @Field(() => Int)
  executionFlags: InstructionExecutionFlags;

  @Field({ nullable: true })
  maxVoteWeight?: string;

  @Field(() => VoteThreshold, { nullable: true })
  voteThreshold?: VoteThreshold;

  @Field({ nullable: true })
  vetoVoteWeight?: string;

  @Field()
  isVoteFinalized: boolean;

  @Field()
  isFinalState: boolean;

  @Field()
  stateTimestamp: Date;

  @Field(() => Int)
  stateSortRank: number;

  @Field()
  isPreVotingState: boolean;

  @Field(() => ProposalOption, { nullable: true })
  yesVoteOption?: ProposalOption;

  @Field({ nullable: true })
  yesVoteCount: string;

  @Field({ nullable: true })
  noVoteCount: string;

  @Field()
  timeToVoteEnd: number;

  @Field()
  voteTimeEnded: boolean;

  @Field(() => Int)
  state: number;

  @Field({ nullable: true })
  descriptionLink?: string;

  @Field()
  draftAt: Date;

  @Field({ nullable: true })
  signingOffAt?: Date;

  @Field({ nullable: true })
  startVotingAt?: Date;

  @Field({ nullable: true })
  votingCompletedAt?: Date;

  @Field({ nullable: true })
  votingAt?: Date;

  @Field({ nullable: true })
  estimatedVoteCompletionAt?: Date;

  @Field({ nullable: true })
  closedAt?: Date;

  @Field({ nullable: true })
  executingAt?: Date;
}

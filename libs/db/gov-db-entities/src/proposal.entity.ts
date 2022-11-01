import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';
import type {
  Proposal as IProposal,
  ProposalOption,
  VoteThreshold,
  VoteType,
} from '@gilder/types';
import { BaseGovEntity } from './base.entity';
import {
  GovernanceAccountType,
  InstructionExecutionFlags,
} from '@solana/spl-governance';

@Entity()
export class Proposal
  extends BaseGovEntity
  implements IProposal<string, string, VoteType, ProposalOption<string>>
{
  @PrimaryColumn('text')
  proposalPk: string;

  @Column('text')
  governancePk: string;

  @Column('text')
  realmPk: string;

  @Column('text')
  name: string;

  @Column('int')
  state: number;

  @Column('text', {
    nullable: true,
  })
  descriptionLink?: string;

  @Column('int')
  accountType: GovernanceAccountType;

  @Column('text')
  governingTokenMintPk: string;

  @Column('text')
  tokenOwnerRecordPk: string;

  @Column('int', { nullable: true })
  signatoriesCount?: number;

  @Column('int', { nullable: true })
  signatoriesSignedOffCount?: number;

  @Column('int', { nullable: true })
  instructionsExecutedCount?: number;

  @Column('int', { nullable: true })
  instructionsCount?: number;

  @Column('int', { nullable: true })
  instructionsNextIndex?: number;

  @Column('jsonb', { nullable: true })
  voteType?: VoteType;

  @Column('jsonb', { nullable: true })
  options?: ProposalOption<string>[];

  @Column('text', { nullable: true })
  denyVoteWeight?: string;

  @Column('text', { nullable: true })
  abstainVoteWeight?: string;

  @Column('decimal', { nullable: true })
  maxVotingTime?: number;

  @Column('text', { nullable: true })
  votingAtSlot?: string;

  @Column('int')
  executionFlags: InstructionExecutionFlags;

  @Column('text', { nullable: true })
  maxVoteWeight?: string;

  @Column('jsonb', { nullable: true })
  voteThreshold?: VoteThreshold;

  @Column('text', { nullable: true })
  vetoVoteWeight?: string;

  @Column('bool')
  isVoteFinalized: boolean;

  @Column('bool')
  isFinalState: boolean;

  @Column('timestamp without time zone')
  stateTimestamp: Date;

  @Column('int')
  stateSortRank: number;

  @Column('bool')
  isPreVotingState: boolean;

  @Column('jsonb', { nullable: true })
  yesVoteOption?: ProposalOption<string>;

  @Column('text', { nullable: true })
  yesVoteCount: string;

  @Column('text', { nullable: true })
  noVoteCount: string;

  @Column('decimal')
  timeToVoteEnd: number;

  @Column('bool')
  voteTimeEnded: boolean;

  @Column('timestamp without time zone')
  draftAt: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  signingOffAt?: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  startVotingAt?: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  votingCompletedAt?: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  votingAt?: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  estimatedVoteCompletionAt?: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  closedAt?: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  executingAt?: Date;
}

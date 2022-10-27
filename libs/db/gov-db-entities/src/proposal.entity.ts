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
@Unique('proposal-constraint', ['proposalPk'])
export class Proposal
  extends BaseGovEntity
  implements IProposal<string, string>
{
  @PrimaryColumn('text')
  proposalPk: string;

  @Column('int')
  accountType: GovernanceAccountType;

  @Column('text')
  governingTokenMintPk: string;

  @Column('text')
  tokenOwnerRecordPk: string;

  @Column('int')
  signatoriesCount: number;

  @Column('int')
  signatoriesSignedOffCount: number;

  @Column('int')
  instructionsExecutedCount: number;

  @Column('int')
  instructionsCount: number;

  @Column('int')
  instructionsNextIndex: number;

  @Column('int')
  voteType: VoteType;

  @Column('jsonb')
  options: ProposalOption<string>[];

  @Column('text', { nullable: true })
  denyVoteWeight?: string;

  @Column('text', { nullable: true })
  abstainVoteWeight?: string;

  @Column('int', { nullable: true })
  maxVotingTime?: number;

  @Column('text', { nullable: true })
  votingAtSlot?: string;

  @Column('int')
  executionFlags: InstructionExecutionFlags;

  @Column('text', { nullable: true })
  maxVoteWeight?: string;

  @Column('jsonb')
  voteThreshold: VoteThreshold;

  @Column('text')
  vetoVoteWeight: string;

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

  @Column('jsonb')
  yesVoteOption: ProposalOption<string>;

  @Column('text')
  yesVoteCount: string;

  @Column('text')
  noVoteCount: string;

  @Column('int')
  timeToVoteEnd: number;

  @Column('bool')
  voteTimeEnded: boolean;

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

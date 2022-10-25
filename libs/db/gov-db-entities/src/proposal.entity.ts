import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';
import type { Proposal as IProposal } from '@gilder/types';
import { BaseGovEntity } from './base.entity';

@Entity()
@Unique('proposal-constraint', ['proposalPk'])
export class Proposal extends BaseGovEntity implements IProposal<string> {
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

  @Column({
    type: 'text',
    nullable: true,
  })
  descriptionLink?: string;

  @Column('timestamp')
  draftAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  signingOffAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  startVotingAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  votingCompletedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  votingAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  estimatedVoteCompletionAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  executingAt?: Date;
}

import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Unique,
  PrimaryColumn,
} from 'typeorm';
import type { Proposal as IProposal } from '@gilderlabs/types';

@Entity()
@Unique('constraint_name', ['proposalPk'])
export class Proposal implements IProposal<string> {
  @PrimaryColumn('text')
  proposalPk: string;

  @Column('text')
  programPk: string;

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

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}

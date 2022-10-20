import type {
  Vote,
  VoteRecord as IVoteRecord,
  VoteWeight,
} from '@gilder/types';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique('vote-record-constraint', ['proposalPk', 'governingTokenOwnerPk'])
export class VoteRecord implements IVoteRecord<string, string> {
  @Column('int')
  accountType: number;

  @PrimaryGeneratedColumn('uuid')
  voteId: string;

  @Column('text')
  proposalPk: string;

  @Column('text')
  governingTokenOwnerPk: string;

  @Column('bool')
  isRelinquished: boolean;

  @Column('jsonb', { nullable: true })
  voteWeight?: VoteWeight<string>;

  @Column('text', { nullable: true })
  voterWeight?: string;

  @Column('jsonb', { nullable: true })
  vote?: Vote;

  @Column('text', { nullable: true })
  noVoteWeight?: string;

  @Column('text', { nullable: true })
  yesVoteWeight?: string;
}

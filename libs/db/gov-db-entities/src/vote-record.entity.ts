import type {
  Vote,
  VoteRecord as IVoteRecord,
  VoteWeight,
} from '@gilder/types';
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { BaseGovEntity } from './base.entity';

@Entity()
export class VoteRecord
  extends BaseGovEntity
  implements IVoteRecord<string, string>
{
  @Column('int')
  accountType: number;

  @PrimaryColumn('text')
  proposalPk: string;

  @PrimaryColumn('text')
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

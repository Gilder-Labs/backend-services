import {
  Entity,
  Column,
  Unique,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { TokenOwner as ITokenOwner } from '@gilder/types';

@Entity()
@Unique('constraint_name', ['ownerPk', 'realmPk'])
export class TokenOwner implements ITokenOwner {
  @PrimaryColumn('text')
  ownerPk: string;

  @Column('text')
  governanceAccountType: number;

  @Column('text')
  realmPk: string;

  @Column('text')
  governingTokenMintPk: string;

  @Column('text')
  governingTokenOwnerPk: string;

  @Column('int')
  governingTokenDespositAmount: number;

  @Column('int')
  unrelinquishedVotesCount: number;

  @Column('int')
  totalVotesCount: number;

  @Column('int')
  outstandingProposalCount: number;

  @Column('text')
  governanceDelegatePk: string;

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

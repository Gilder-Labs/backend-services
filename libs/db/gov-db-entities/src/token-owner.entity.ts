import { Entity, Column, PrimaryColumn } from 'typeorm';
import type { TokenOwner as ITokenOwner } from '@gilder/types';
import { BaseGovEntity } from './base.entity';
import { GovernanceAccountType } from '@solana/spl-governance';

@Entity()
export class TokenOwner
  extends BaseGovEntity
  implements ITokenOwner<string, string>
{
  @Column('int')
  accountType: GovernanceAccountType;

  @PrimaryColumn('text')
  ownerPk: string;

  @Column('text')
  realmPk: string;

  @Column('text')
  governingTokenMintPk: string;

  @Column('text')
  governingTokenOwnerPk: string;

  @Column('text')
  governingTokenDespositAmount: string;

  @Column('int')
  unrelinquishedVotesCount: number;

  @Column('int')
  totalVotesCount: number;

  @Column('int')
  outstandingProposalCount: number;

  @Column('text', {
    nullable: true,
  })
  governanceDelegatePk?: string;
}

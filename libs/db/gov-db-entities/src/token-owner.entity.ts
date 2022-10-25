import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';
import type { TokenOwner as ITokenOwner } from '@gilder/types';
import { BaseGovEntity } from './base.entity';

@Entity()
@Unique('token-owner-constraint', ['ownerPk'])
export class TokenOwner
  extends BaseGovEntity
  implements ITokenOwner<string, string>
{
  @PrimaryColumn('text')
  ownerPk: string;

  @Column('int')
  governanceAccountType: number;

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

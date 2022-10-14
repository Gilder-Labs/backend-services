import { Entity, Column, Unique, PrimaryColumn, BaseEntity } from 'typeorm';
import type {
  Governance as IGovernance,
  GovernanceConfig,
} from '@gilderlabs/types';

@Entity()
@Unique('constraint_name', ['governancePk'])
export class Governance
  extends BaseEntity
  implements IGovernance<string, string>
{
  @PrimaryColumn('text')
  governancePk: string;

  @Column('int')
  accountType: number;

  @Column('text')
  realmPk: string;

  @Column('text')
  governedAccountPk: string;

  @Column('jsonb')
  config: GovernanceConfig<string>;

  @Column('int')
  proposalCount: number;

  @Column('int')
  votingProposalCount: number;

  @Column('bool')
  isProgramGovernance: boolean;

  @Column('bool')
  isAccountGovernance: boolean;

  @Column('bool')
  isMintGovernance: boolean;

  @Column('bool')
  isTokenGovernance: boolean;
}

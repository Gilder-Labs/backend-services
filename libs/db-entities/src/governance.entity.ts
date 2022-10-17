import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';
import type {
  Governance as IGovernance,
  GovernanceConfig,
} from '@gilder/types';

@Entity()
@Unique('constraint_name', ['governancePk'])
export class Governance implements IGovernance<string, string> {
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

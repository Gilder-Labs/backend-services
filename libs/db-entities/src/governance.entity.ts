import {
  Entity,
  Column,
  Unique,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type {
  Governance as IGovernance,
  GovernanceConfig,
} from '@gilder/types';

@Entity()
@Unique('constraint_name', ['governancePk', 'realmPk'])
export class Governance implements IGovernance {
  @PrimaryColumn('text')
  governancePk: string;

  @Column('int')
  accountType: number;

  @Column('text')
  realmPk: string;

  @Column('text')
  governedAccountPk: string;

  @Column('jsonb')
  config: GovernanceConfig;

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

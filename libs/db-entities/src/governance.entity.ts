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
import { PublicKey } from '@solana/web3.js';
import { PublicKeyTransformer } from './transformer/public-key.transformer';

@Entity()
@Unique('constraint_name', ['governancePk'])
export class Governance implements IGovernance {
  @PrimaryColumn('text', {
    transformer: new PublicKeyTransformer(),
  })
  governancePk: PublicKey;

  @Column('int')
  accountType: number;

  @Column('text', {
    transformer: new PublicKeyTransformer(),
  })
  realmPk: PublicKey;

  @Column('text', {
    transformer: new PublicKeyTransformer(),
  })
  governedAccountPk: PublicKey;

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

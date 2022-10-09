import {
  Entity,
  Column,
  Unique,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { TokenOwner as ITokenOwner } from '@gilder/types';
import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import { PublicKeyTransformer } from './transformer/public-key.transformer';

@Entity()
@Unique('constraint_name', ['ownerPk'])
export class TokenOwner implements ITokenOwner {
  @PrimaryColumn('text', {
    transformer: new PublicKeyTransformer(),
  })
  ownerPk: PublicKey;

  @Column('int')
  governanceAccountType: number;

  @Column('text', {
    transformer: new PublicKeyTransformer(),
  })
  realmPk: PublicKey;

  @Column('text', {
    transformer: new PublicKeyTransformer(),
  })
  governingTokenMintPk: PublicKey;

  @Column('text', {
    transformer: new PublicKeyTransformer(),
  })
  governingTokenOwnerPk: PublicKey;

  @Column('text', {
    transformer: {
      from: (value: string) => new BN(value),
      to: (value: BN) => value.toString(),
    },
  })
  governingTokenDespositAmount: BN;

  @Column('int')
  unrelinquishedVotesCount: number;

  @Column('int')
  totalVotesCount: number;

  @Column('int')
  outstandingProposalCount: number;

  @Column('text', {
    nullable: true,
    transformer: new PublicKeyTransformer(),
  })
  governanceDelegatePk?: PublicKey;

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

import {
  Entity,
  Column,
  Unique,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Realm as IRealm } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';
import { PublicKeyTransformer } from './transformer/public-key.transformer';

@Entity()
@Unique('constraint_name', ['realmPk'])
export class Realm implements IRealm {
  @PrimaryColumn('text', {
    transformer: new PublicKeyTransformer(),
  })
  realmPk: PublicKey;

  @Column('text', {
    nullable: true,
    transformer: new PublicKeyTransformer(),
  })
  programPk: PublicKey;

  @Column('text', {
    nullable: true,
  })
  name: string;

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

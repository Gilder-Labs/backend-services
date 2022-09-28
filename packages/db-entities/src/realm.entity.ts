import {
  Entity,
  Column,
  Unique,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Realm as IRealm } from '@gilder/types';

@Entity()
@Unique('constraint_name', ['realmPk'])
export class Realm implements IRealm {
  @PrimaryColumn('text')
  realmPk: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  governancePk: string;

  @Column({
    type: 'text',
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

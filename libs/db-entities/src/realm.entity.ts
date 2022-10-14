import { Entity, Column, Unique, PrimaryColumn, BaseEntity } from 'typeorm';
import type { Realm as IRealm } from '@gilder/types';

@Entity()
@Unique('constraint_name', ['realmPk'])
export class Realm extends BaseEntity implements IRealm<string> {
  @PrimaryColumn('text')
  realmPk: string;

  @Column('text', {
    nullable: true,
  })
  programPk: string;

  @Column('text', {
    nullable: true,
  })
  name: string;
}

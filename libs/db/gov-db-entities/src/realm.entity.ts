import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';
import type { Realm as IRealm, RealmConfig } from '@gilder/types';

@Entity()
@Unique('realm-constraint', ['realmPk'])
export class Realm implements IRealm<string, string> {
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

  @Column('text')
  communityMintPk: string;

  @Column('int')
  votingProposalCount: number;

  @Column('text', { nullable: true })
  authorityPk?: string;

  @Column('jsonb')
  config: RealmConfig<string, string>;
}

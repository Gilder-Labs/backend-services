import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';
import type { Realm as IRealm, RealmConfig } from '@gilder/types';
import { BaseGovEntity } from './base.entity';

@Entity()
@Unique('realm-constraint', ['realmPk'])
export class Realm extends BaseGovEntity implements IRealm<string, string> {
  @PrimaryColumn('text')
  realmPk: string;

  @Column('text')
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

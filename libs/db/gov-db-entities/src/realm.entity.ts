import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';
import type {
  RawMintMaxVoteWeightSource,
  Realm as IRealm,
  RealmConfig,
} from '@gilder/types';
import { BaseGovEntity } from './base.entity';
import { GovernanceAccountType } from '@solana/spl-governance';

@Entity()
@Unique('realm-constraint', ['realmPk'])
export class Realm
  extends BaseGovEntity
  implements IRealm<string, string, RawMintMaxVoteWeightSource<string>>
{
  @PrimaryColumn('text')
  realmPk: string;

  @Column('int')
  accountType: GovernanceAccountType;

  @Column('text')
  name: string;

  @Column('text')
  communityMintPk: string;

  @Column('int')
  votingProposalCount: number;

  @Column('text', { nullable: true })
  authorityPk?: string;

  @Column('jsonb')
  config: RealmConfig<string, string, RawMintMaxVoteWeightSource<string>>;
}

import type { SignatoryRecord as ISignatoryRecord } from '@gilder/types';
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { BaseGovEntity } from './base.entity';

@Entity()
export class SignatoryRecord
  extends BaseGovEntity
  implements ISignatoryRecord<string>
{
  @Column('int')
  accountType: number;

  @PrimaryColumn('text')
  proposalPk: string;

  @PrimaryColumn('text')
  signatoryPk: string;

  @Column('bool')
  signedOff: boolean;
}

import type { SignatoryRecord as ISignatoryRecord } from '@gilder/types';
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { BaseGovEntity } from './base.entity';

@Entity()
@Unique('signatory-record-constraint', ['signatoryPk', 'proposalPk'])
export class SignatoryRecord
  extends BaseGovEntity
  implements ISignatoryRecord<string>
{
  @Column('int')
  accountType: number;

  @Column('text')
  proposalPk: string;

  @PrimaryColumn('text')
  signatoryPk: string;

  @Column('bool')
  signedOff: boolean;
}

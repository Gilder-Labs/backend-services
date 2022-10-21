import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import type { ProgramMetadata as IProgramMetadata } from '@gilder/types';
import { BaseGovEntity } from './base.entity';

@Entity()
export class ProgramMetadata
  extends BaseGovEntity
  implements IProgramMetadata<string>
{
  @PrimaryColumn('text')
  declare programPk: string;

  @Column('int')
  accountType: number;

  @Column('text')
  updatedAt: Date;

  @PrimaryColumn('text')
  version: string;
}

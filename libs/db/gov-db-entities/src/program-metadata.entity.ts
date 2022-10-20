import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { PrograMetadata as IProgramMetadata } from '@gilder/types';
import { BaseGovEntity } from './base.entity';

@Entity()
export class ProgramMetadata
  extends BaseGovEntity
  implements IProgramMetadata<string, string>
{
  @PrimaryGeneratedColumn('uuid')
  programMetadataId: string;

  @Column('int')
  accountType: number;

  @Column('text')
  updatedAt: string;

  @Column('text')
  version: string;
}

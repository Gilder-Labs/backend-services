import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { PrograMetadata as IProgramMetadata } from '@gilder/types';

@Entity()
export class ProgramMetadata implements IProgramMetadata<string> {
  @PrimaryGeneratedColumn('uuid')
  programMetadataId: string;

  @Column('int')
  accountType: number;

  @Column('text')
  updatedAt: string;

  @Column('text')
  version: string;
}

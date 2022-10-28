import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import type {
  InstructionData,
  ProposalTransaction as IProposalTransaction,
} from '@gilder/types';
import { BaseGovEntity } from './base.entity';

@Entity()
export class ProposalTransaction
  extends BaseGovEntity
  implements IProposalTransaction<string>
{
  @Column('int')
  accountType: number;

  @PrimaryColumn('text')
  proposalPk: string;

  @PrimaryColumn('int')
  instructionIndex: number;

  @Column('jsonb', { nullable: true })
  instruction?: InstructionData<string>;

  @Column('int')
  optionIndex: number;

  @Column('jsonb')
  instructions: InstructionData<string>[];

  @Column('int')
  holdUpTime: number;

  @Column('timestamp without time zone', { nullable: true })
  executedAt?: Date;

  @Column('int')
  executionStatus: number;
}

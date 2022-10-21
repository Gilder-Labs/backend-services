import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import type {
  InstructionData,
  ProposalTransaction as IProposalTransaction,
} from '@gilder/types';
import { BaseGovEntity } from './base.entity';

@Entity()
export class ProposalTransaction
  extends BaseGovEntity
  implements IProposalTransaction<string, string>
{
  @Column('int')
  accountType: number;

  @PrimaryColumn('text')
  proposalPk: string;

  @PrimaryColumn('int')
  instructionIndex: number;

  @Column('jsonb')
  instruction: InstructionData<string>;

  @Column('int')
  optionIndex: number;

  @Column('jsonb')
  instructions: InstructionData<string>[];

  @Column('int')
  holdUpTime: number;

  @Column('text', { nullable: true })
  executedAt?: string | undefined;

  @Column('int')
  executionStatus: number;
}

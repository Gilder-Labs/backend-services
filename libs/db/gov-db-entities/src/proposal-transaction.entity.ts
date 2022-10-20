import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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
  @PrimaryGeneratedColumn('uuid')
  proposalTransactionId: string;

  @Column('int')
  accountType: number;

  @Column('text')
  proposalPk: string;

  @Column('int')
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

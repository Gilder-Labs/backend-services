import type {
  AccountMetadata as IAccountMetadata,
  InstructionData as IInstructionData,
  ProposalTransaction as IProposalTransaction,
} from '@gilder/types';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GovernanceAccountType } from '@solana/spl-governance';

@ObjectType()
export class AccountMetadata implements IAccountMetadata<string> {
  @Field()
  pubkey: string;

  @Field()
  isSigner: boolean;

  @Field()
  isWritable: boolean;
}

@ObjectType()
export class InstructionData implements IInstructionData<string> {
  @Field({ nullable: true })
  programId: string;

  @Field(() => [AccountMetadata], { nullable: true })
  accounts: AccountMetadata[];
}

@ObjectType()
export class ProposalTransaction implements IProposalTransaction<string> {
  @Field(() => Int)
  accountType: GovernanceAccountType;

  @Field()
  proposalPk: string;

  @Field()
  programPk: string;

  @Field()
  instructionIndex: number;

  @Field(() => InstructionData, { nullable: true })
  instruction?: InstructionData;

  @Field()
  optionIndex: number;

  @Field(() => [InstructionData])
  instructions: InstructionData[];

  @Field()
  holdUpTime: number;

  @Field({ nullable: true })
  executedAt?: Date;

  @Field()
  executionStatus: number;
}

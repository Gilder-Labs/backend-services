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
  @Field()
  programId: string;

  @Field(() => [AccountMetadata])
  accounts: AccountMetadata[];
}

@ObjectType()
export class ProposalTransaction
  implements IProposalTransaction<string, string>
{
  @Field(() => Int)
  accountType: GovernanceAccountType;

  @Field()
  proposalPk: string;

  @Field()
  programPk: string;

  @Field()
  instructionIndex: number;

  @Field(() => InstructionData)
  instruction: InstructionData;

  @Field()
  optionIndex: number;

  @Field(() => [InstructionData])
  instructions: InstructionData[];

  @Field()
  holdUpTime: number;

  @Field({ nullable: true })
  executedAt?: string;

  @Field()
  executionStatus: number;
}

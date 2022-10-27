import type { SignatoryRecord as ISignatoryRecord } from '@gilder/types';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GovernanceAccountType } from '@solana/spl-governance';

@ObjectType()
export class SignatoryRecord implements ISignatoryRecord<string> {
  @Field(() => Int)
  accountType: GovernanceAccountType;

  @Field()
  proposalPk: string;

  @Field()
  programPk: string;

  @Field()
  signatoryPk: string;

  @Field()
  signedOff: boolean;
}

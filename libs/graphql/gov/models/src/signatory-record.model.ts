import type { SignatoryRecord as ISignatoryRecord } from '@gilder/types';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignatoryRecord implements ISignatoryRecord<string> {
  @Field()
  accountType: number;

  @Field()
  proposalPk: string;

  @Field()
  programPk: string;

  @Field()
  signatoryPk: string;

  @Field()
  signedOff: boolean;
}

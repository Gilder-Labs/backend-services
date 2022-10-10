import { Field, ObjectType } from '@nestjs/graphql';
import type { TokenOwner as ITokenOwner } from '@gilder/types';

@ObjectType()
export class TokenOwner implements ITokenOwner<string, string> {
  @Field()
  ownerPk: string;

  @Field()
  governanceAccountType: number;

  @Field()
  realmPk: string;

  @Field()
  governingTokenMintPk: string;

  @Field()
  governingTokenOwnerPk: string;

  @Field()
  governingTokenDespositAmount: string;

  @Field()
  unrelinquishedVotesCount: number;

  @Field()
  totalVotesCount: number;

  @Field()
  outstandingProposalCount: number;

  @Field({ nullable: true })
  governanceDelegatePk?: string;
}

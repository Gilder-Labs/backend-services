import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { TokenOwner as ITokenOwner } from '@gilder/types';
import { GovernanceAccountType } from '@solana/spl-governance';

@ObjectType()
export class TokenOwner implements ITokenOwner<string, string> {
  @Field(() => Int)
  accountType: GovernanceAccountType;

  @Field()
  programPk: string;

  @Field()
  ownerPk: string;

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

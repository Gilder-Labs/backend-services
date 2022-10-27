import type {
  VoteRecord as IVoteRecord,
  VoteWeight as IVoteWeight,
  Vote as IVote,
  VoteChoice as IVoteChoice,
} from '@gilder/types';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GovernanceAccountType } from '@solana/spl-governance';

@ObjectType()
export class VoteChoice implements IVoteChoice {
  @Field()
  rank: number;

  @Field()
  weightPercentage: number;
}

@ObjectType()
export class Vote implements IVote {
  @Field()
  voteType: number;

  @Field(() => [VoteChoice], { nullable: true })
  approveChoices?: VoteChoice[];

  @Field(() => Boolean, { nullable: true })
  deny?: boolean;

  @Field(() => Boolean, { nullable: true })
  veto?: boolean;
}

@ObjectType()
export class VoteWeight implements IVoteWeight<string> {
  @Field()
  yes: string;

  @Field()
  no: string;
}

@ObjectType()
export class VoteRecord implements IVoteRecord<string, string> {
  @Field(() => Int)
  accountType: GovernanceAccountType;

  @Field()
  proposalPk: string;

  @Field()
  programPk: string;

  @Field()
  governingTokenOwnerPk: string;

  @Field()
  isRelinquished: boolean;

  @Field(() => VoteWeight, { nullable: true })
  voteWeight?: VoteWeight;

  @Field({ nullable: true })
  voterWeight?: string;

  @Field(() => Vote, { nullable: true })
  vote?: Vote;

  @Field({ nullable: true })
  noVoteWeight?: string;

  @Field({ nullable: true })
  yesVoteWeight?: string;
}

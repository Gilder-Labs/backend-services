import type {
  VoteRecord as IVoteRecord,
  VoteWeight as IVoteWeight,
  Vote as IVote,
  VoteChoice as IVoteChoice,
} from '@gilder/types';
import { Field, ObjectType } from '@nestjs/graphql';

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
  @Field()
  accountType: number;

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

  @Field(() => String, { nullable: true })
  voterWeight?: string;

  @Field(() => Vote, { nullable: true })
  vote?: Vote;

  @Field(() => String, { nullable: true })
  noVoteWeight?: string;

  @Field(() => String, { nullable: true })
  yesVoteWeight?: string;
}

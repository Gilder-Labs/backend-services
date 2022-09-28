import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { Proposal as IProposal } from '@gilder/types';

@ObjectType()
export class Proposal implements IProposal {
  @Field()
  proposalPk: string;

  @Field()
  programPk: string;

  @Field()
  realmPk: string;

  @Field()
  name: string;

  @Field(() => Int)
  state: number;

  @Field({ nullable: true })
  descriptionLink?: string;

  @Field()
  draftAt: Date;

  @Field({ nullable: true })
  signingOffAt?: Date;

  @Field({ nullable: true })
  startVotingAt?: Date;

  @Field({ nullable: true })
  votingCompletedAt?: Date;

  @Field({ nullable: true })
  votingAt?: Date;

  @Field({ nullable: true })
  estimatedVoteCompletionAt?: Date;

  @Field({ nullable: true })
  closedAt?: Date;

  @Field({ nullable: true })
  executingAt?: Date;
}

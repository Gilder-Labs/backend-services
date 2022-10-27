import { Field, ObjectType } from '@nestjs/graphql';
import type {
  RawMintMaxVoteWeightSource,
  Realm as IRealm,
  RealmConfig as IRealmConfig,
} from '@gilder/types';
import { TokenOwner } from './token-owner.model';
import { Proposal } from './proposal.model';
import { Governance } from './governance.model';

@ObjectType()
export class MintMaxVoteWeightSource {
  @Field()
  type: number;

  @Field()
  value: string;
}

@ObjectType()
export class RealmConfig implements IRealmConfig<string, string> {
  @Field(() => String, { nullable: true })
  councilMintPk?: string | undefined;

  @Field(() => MintMaxVoteWeightSource)
  communityMintMaxVoteWeightSource: MintMaxVoteWeightSource;

  @Field()
  minCommunityTokensToCreateGovernance: string;

  @Field()
  useCommunityVoterWeightAddin: boolean;

  @Field()
  useMaxCommunityVoterWeightAddin: boolean;
}

@ObjectType()
export class Realm
  implements IRealm<string, string, RawMintMaxVoteWeightSource<string>>
{
  @Field()
  realmPk: string;

  @Field()
  programPk: string;

  @Field()
  name: string;

  @Field(() => [Proposal], { nullable: true })
  proposals?: Proposal[];

  @Field(() => [Governance], { nullable: true })
  governances?: TokenOwner[];

  @Field(() => [TokenOwner], { nullable: true })
  members?: TokenOwner[];

  @Field()
  communityMintPk: string;

  @Field()
  votingProposalCount: number;

  @Field(() => String, { nullable: true })
  authorityPk?: string | undefined;

  @Field(() => RealmConfig)
  config: IRealmConfig<string, string>;
}

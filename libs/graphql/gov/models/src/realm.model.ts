import { Field, Int, ObjectType } from '@nestjs/graphql';
import type {
  RawMintMaxVoteWeightSource,
  Realm as IRealm,
  RealmConfig as IRealmConfig,
} from '@gilder/types';
import { TokenOwner } from './token-owner.model';
import { Proposal } from './proposal.model';
import { Governance } from './governance.model';
import { GovernanceAccountType } from '@solana/spl-governance';

@ObjectType()
export class MintMaxVoteWeightSource
  implements RawMintMaxVoteWeightSource<string>
{
  @Field()
  type: number;

  @Field()
  value: string;
}

@ObjectType()
export class RealmConfig
  implements IRealmConfig<string, string, RawMintMaxVoteWeightSource<string>>
{
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
  @Field(() => Int)
  accountType: GovernanceAccountType;

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

  @Field({ nullable: true })
  authorityPk?: string;

  @Field(() => RealmConfig)
  config: RealmConfig;
}

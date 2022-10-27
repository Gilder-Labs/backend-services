import { Field, Int, ObjectType } from '@nestjs/graphql';
import type {
  Governance as IGovernance,
  GovernanceConfig as IGovernanceConfig,
  VoteThreshold as IVoteThreshold,
} from '@gilder/types';
import { Proposal } from './proposal.model';
import { GovernanceAccountType } from '@solana/spl-governance';

@ObjectType()
export class VoteThreshold implements IVoteThreshold {
  @Field()
  type: number;

  @Field({ nullable: true })
  value?: number;
}

@ObjectType()
export class GovernanceConfig implements IGovernanceConfig<string> {
  @Field(() => VoteThreshold)
  communityVoteThreshold: IVoteThreshold;

  @Field()
  minCommunityTokensToCreateProposal: string;

  @Field()
  minInstructionHoldUpTime: number;

  @Field()
  maxVotingTime: number;

  @Field()
  communityVoteTipping: number;

  @Field()
  minCouncilTokensToCreateProposal: string;

  @Field(() => VoteThreshold)
  councilVoteThreshold: IVoteThreshold;

  @Field(() => VoteThreshold)
  councilVetoVoteThreshold: IVoteThreshold;

  @Field(() => VoteThreshold)
  communityVetoVoteThreshold: IVoteThreshold;

  @Field()
  councilVoteTipping: number;
}

@ObjectType()
export class Governance implements IGovernance<string, string> {
  @Field()
  programPk: string;

  @Field()
  governancePk: string;

  @Field(() => Int)
  accountType: GovernanceAccountType;

  @Field()
  realmPk: string;

  @Field()
  governedAccountPk: string;

  @Field(() => GovernanceConfig)
  config: GovernanceConfig;

  @Field()
  proposalCount: number;

  @Field()
  votingProposalCount: number;

  @Field()
  isProgramGovernance: boolean;

  @Field()
  isAccountGovernance: boolean;

  @Field()
  isMintGovernance: boolean;

  @Field()
  isTokenGovernance: boolean;

  @Field(() => [Proposal], { nullable: true })
  proposals?: Proposal[];
}

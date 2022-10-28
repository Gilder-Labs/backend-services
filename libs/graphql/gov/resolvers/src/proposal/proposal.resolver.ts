import { ProposalsService } from '@gilder/gov-service-module';
import { Proposal } from '@gilder/graphql-gov-models';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GovernanceAccountType } from '@solana/spl-governance';

@Resolver(Proposal)
export class ProposalsResolver {
  constructor(private readonly proposalService: ProposalsService) {}

  @Query(() => [Proposal])
  async proposals(): Promise<Proposal[]> {
    return this.proposalService.getAll();
  }

  @Query(() => [Proposal])
  async proposalsV1(): Promise<Proposal[]> {
    return this.proposalService.filterBy({
      accountType: GovernanceAccountType.ProposalV1,
    });
  }

  @Query(() => [Proposal])
  async getProposalsByRealm(@Args('realmPk') realmPk: string) {
    return this.proposalService.filterBy({ realmPk });
  }

  @Query(() => [Proposal])
  async proposalsV2(): Promise<Proposal[]> {
    return this.proposalService.filterBy({
      accountType: GovernanceAccountType.ProposalV2,
    });
  }
}

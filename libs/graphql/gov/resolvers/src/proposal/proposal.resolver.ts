import { ProposalsService } from '@gilder/gov-service-module';
import { Proposal } from '@gilder/graphql-gov-models';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(Proposal)
export class ProposalsResolver {
  constructor(private readonly proposalService: ProposalsService) {}

  @Query(() => [Proposal])
  async proposals(): Promise<Proposal[]> {
    return this.proposalService.getAllProposals();
  }
}

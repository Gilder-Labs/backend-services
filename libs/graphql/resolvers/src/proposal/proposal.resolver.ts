import { Proposal } from '@gilder/graphql-models';
import { ProposalsService } from '@gilder/proposals-module';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(Proposal)
export class ProposalsResolver {
  constructor(private readonly proposalService: ProposalsService) {}

  @Query(() => [Proposal])
  async proposals(): Promise<Proposal[]> {
    return (await this.proposalService.getAllProposals()).map((x) => ({
      ...x,
      programPk: x.programPk.toBase58(),
      realmPk: x.realmPk.toBase58(),
      proposalPk: x.proposalPk.toBase58(),
    }));
  }
}

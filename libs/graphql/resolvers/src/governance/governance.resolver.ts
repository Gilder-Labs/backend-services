import { GovernancesService } from '@gilder/governances-module';
import { Governance } from '@gilder/graphql-models';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(Governance)
export class GovernancesResolver {
  constructor(private readonly governancesService: GovernancesService) {}

  @Query(() => [Governance])
  async governances(): Promise<Governance[]> {
    return (await this.governancesService.getAllGovernances()).map((x) => ({
      ...x,
      realmPk: x.realmPk.toBase58(),
      governancePk: x.governancePk.toBase58(),
      governedAccountPk: x.governedAccountPk.toBase58(),
      config: {
        ...x.config,
        minCommunityTokensToCreateProposal:
          x.config.minCommunityTokensToCreateProposal.toString(),
        minCouncilTokensToCreateProposal:
          x.config.minCouncilTokensToCreateProposal.toString(),
      },
    }));
  }
}

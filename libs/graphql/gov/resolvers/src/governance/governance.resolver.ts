import { Proposal } from '@gilder/gov-db-entities';
import { GovernancesService } from '@gilder/gov-service-module';
import { IDataLoaders } from '@gilder/graphql-gov-dataloaders';
import { Governance } from '@gilder/graphql-gov-models';
import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

@Resolver(Governance)
export class GovernancesResolver {
  constructor(private readonly governancesService: GovernancesService) {}

  @Query(() => [Governance])
  async governances(): Promise<Governance[]> {
    return await this.governancesService.getAll();
  }

  @ResolveField('proposals', () => [Proposal])
  async proposals(
    @Parent() governance: Governance,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<Proposal[]> {
    return loaders.getProposalsByGovernancePk.load(governance.governancePk);
  }
}

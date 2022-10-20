import { GovernancesService } from '@gilder/gov-service-module';
import { Governance } from '@gilder/graphql-gov-models';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(Governance)
export class GovernancesResolver {
  constructor(private readonly governancesService: GovernancesService) {}

  @Query(() => [Governance])
  async governances(): Promise<Governance[]> {
    return await this.governancesService.getAllGovernances();
  }
}

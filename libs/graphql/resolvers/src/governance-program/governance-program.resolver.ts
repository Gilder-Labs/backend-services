import { RealmsRestService } from '@gilder/realms-module';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver('GovernanceProgram')
export class GovernanceProgramResolver {
  constructor(private readonly realmsRestService: RealmsRestService) {}

  @Query(() => [String])
  async governancePrograms(): Promise<string[]> {
    return (await this.realmsRestService.getSplGovernancePrograms()).map((x) =>
      x.toBase58(),
    );
  }
}

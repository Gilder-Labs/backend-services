import { Proposal } from '@gilder/graphql-models';
import { ProposalRPCService, ProposalsService } from '@gilder/proposals-module';
import { Realm } from '@gilder/types';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver('Proposal')
export class ProposalsResolver {
  constructor(
    private readonly proposalService: ProposalsService,
    private readonly proposalRpcService: ProposalRPCService,
  ) {}

  @Query(() => [Proposal])
  async proposals(): Promise<Proposal[]> {
    return this.proposalService.getAllProposals();
  }

  @Query(() => [Proposal])
  async getProposalsByRealm(
    @Args('realmPk') realmPk: string,
    @Args('programPk') programPk: string,
  ): Promise<Proposal[]> {
    const realm = {
      realmPk,
      programPk,
    } as Realm;
    const solanaPropsosals =
      await this.proposalRpcService.getProposalsFromSolanaByRealm(realm);

    return await this.proposalRpcService.convertSolanaProposalToEntity(
      realm,
      solanaPropsosals,
    );
  }
}

import { GovernancesService } from '@gilder/governances-module';
import { IDataLoaders } from '@gilder/graphql-dataloaders';
import {
  Governance,
  Proposal,
  Realm,
  TokenOwner,
} from '@gilder/graphql-models';
import { RealmsService } from '@gilder/realms-module';
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GetRealmArgs } from './args/get-realm-args';

@Resolver(Realm)
export class RealmsResolver {
  constructor(
    private readonly realmsService: RealmsService,
    private readonly governancesService: GovernancesService,
  ) {}

  @Query(() => [Realm])
  async realms(): Promise<Realm[]> {
    return this.realmsService.getAllRealms();
  }

  @Query(() => Realm, { nullable: true })
  async getRealm(@Args() { name, realmPk }: GetRealmArgs) {
    if (name) {
      return this.realmsService.getRealmByName(name);
    } else if (realmPk) {
      return this.realmsService.getRealmByPubKey(realmPk);
    } else {
      return null;
    }
  }

  @ResolveField('proposals', () => [Proposal])
  async proposals(
    @Parent() realm: Realm,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<Proposal[]> {
    const { realmPk } = realm;
    return loaders.proposalsLoader.load(realmPk);
  }

  @ResolveField('governances', () => [Governance])
  async governances(@Parent() realm: Realm): Promise<Governance[]> {
    const { realmPk } = realm;
    return this.governancesService.getAllGovernancesByRealm(realmPk);
  }

  @ResolveField('tokenOwners', () => [TokenOwner])
  async tokenOwners(
    @Parent() realm: Realm,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<TokenOwner[]> {
    const { realmPk } = realm;
    return loaders.tokenOwnersLoader.load(realmPk);
  }
}

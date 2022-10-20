import { RealmsService } from '@gilder/gov-service-module';
import { IDataLoaders } from '@gilder/graphql-gov-dataloaders';
import {
  Governance,
  Proposal,
  Realm,
  TokenOwner,
} from '@gilder/graphql-gov-models';
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
  constructor(private readonly realmsService: RealmsService) {}

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
  async governances(
    @Parent() realm: Realm,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<Governance[]> {
    const { realmPk } = realm;
    return loaders.governancesLoader.load(realmPk);
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

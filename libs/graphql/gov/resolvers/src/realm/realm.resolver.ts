import { RealmsService } from '@gilder/gov-service-module';
import { IDataLoaders } from '@gilder/graphql-gov-dataloaders';
import {
  Governance,
  Proposal,
  Realm,
  TokenOwner,
} from '@gilder/graphql-gov-models';
import { Inject } from '@nestjs/common';
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GovernanceAccountType } from '@solana/spl-governance';
import { GetRealmArgs } from './args/get-realm-args';

@Resolver(Realm)
export class RealmsResolver {
  @Inject(RealmsService)
  private readonly realmsService!: RealmsService;

  @Query(() => [Realm])
  async realms(): Promise<Realm[]> {
    return this.realmsService.getAll();
  }

  @Query(() => [Realm])
  async realmsV1(): Promise<Realm[]> {
    return this.realmsService.filterBy({
      accountType: GovernanceAccountType.RealmV1,
    });
  }

  @Query(() => [Realm])
  async realmsV2(): Promise<Realm[]> {
    return this.realmsService.filterBy({
      accountType: GovernanceAccountType.RealmV2,
    });
  }

  @Query(() => Realm, { nullable: true })
  async getRealm(@Args() { name, realmPk }: GetRealmArgs) {
    if (name) {
      return this.realmsService.getBy({ name });
    } else if (realmPk) {
      return this.realmsService.getBy({ realmPk });
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
    return loaders.getProposalsByRealmPk.load(realmPk);
  }

  @ResolveField('governances', () => [Governance])
  async governances(
    @Parent() realm: Realm,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<Governance[]> {
    const { realmPk } = realm;
    return loaders.getGovernancesByRealmPk.load(realmPk);
  }

  @ResolveField('tokenOwners', () => [TokenOwner])
  async tokenOwners(
    @Parent() realm: Realm,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<TokenOwner[]> {
    const { realmPk } = realm;
    return loaders.getTokenOwnersByRealmPk.load(realmPk);
  }
}

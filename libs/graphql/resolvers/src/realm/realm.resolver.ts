import { Proposal, Realm, TokenOwner } from '@gilder/graphql-models';
import { ProposalsService } from '@gilder/proposals-module';
import { RealmsService } from '@gilder/realms-module';
import { TokenOwnersService } from '@gilder/token-owners-module';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GetRealmArgs } from './args/get-realm-args';

@Resolver(Realm)
export class RealmsResolver {
  constructor(
    private readonly realmsService: RealmsService,
    private readonly tokenOwnerService: TokenOwnersService,
    private readonly proposalService: ProposalsService,
  ) {}

  @Query(() => [Realm])
  async realms(): Promise<Realm[]> {
    return (await this.realmsService.getAllRealms()).map((x) => ({
      ...x,
      programPk: x.programPk.toBase58(),
      realmPk: x.realmPk.toBase58(),
    }));
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
  async proposals(@Parent() realm: Realm): Promise<Proposal[]> {
    const { realmPk } = realm;
    return (await this.proposalService.getAllProposalsInRealm(realmPk)).map(
      (x) => ({
        ...x,
        programPk: x.programPk.toBase58(),
        realmPk: x.realmPk.toBase58(),
        proposalPk: x.proposalPk.toBase58(),
      }),
    );
  }

  @ResolveField('tokenOwners', () => [TokenOwner])
  async tokenOwners(@Parent() realm: Realm): Promise<TokenOwner[]> {
    const { realmPk } = realm;
    return (await this.tokenOwnerService.getAllTokenOwnersInRealm(realmPk)).map(
      (x) => ({
        ...x,
        ownerPk: x.ownerPk.toBase58(),
        realmPk: x.realmPk.toBase58(),
        governanceDelegatePk: x.governanceDelegatePk?.toBase58(),
        governingTokenMintPk: x.governingTokenMintPk.toBase58(),
        governingTokenOwnerPk: x.governingTokenOwnerPk.toBase58(),
        governingTokenDespositAmount: x.governingTokenDespositAmount.toString(),
      }),
    );
  }
}

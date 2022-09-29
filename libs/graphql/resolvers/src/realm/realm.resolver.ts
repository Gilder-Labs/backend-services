import { Realm } from '@gilder/graphql-models';
import { RealmsService } from '@gilder/realms-module';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetRealmArgs } from './args/get-realm-args';

@Resolver('Realm')
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
}

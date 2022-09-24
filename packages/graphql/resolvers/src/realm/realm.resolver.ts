import { Realm } from '@gilder/graphql-models';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => Realm)
export class RealmsResolver {
  constructor() {}

  @Query(() => Realm)
  async author(@Args('realmPk') realmPk: string) {
    return [];
  }
}

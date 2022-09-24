import { Field, ObjectType } from '@nestjs/graphql';
import type { Realm as IRealm } from '@gilder/types';

@ObjectType()
export class Realm implements IRealm {
  @Field()
  realmPk: string;

  @Field()
  governancePk: string;

  @Field()
  name: string;
}

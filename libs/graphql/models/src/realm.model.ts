import { Field, ObjectType } from '@nestjs/graphql';
import type { Realm as IRealm } from '@gilder/types';
import { TokenOwner } from './token-owner.model';
import { Proposal } from './proposal.model';

@ObjectType()
export class Realm implements IRealm<string> {
  @Field()
  realmPk: string;

  @Field()
  programPk: string;

  @Field()
  name: string;

  @Field(() => [Proposal], { nullable: true })
  proposals?: Proposal[];

  @Field(() => [TokenOwner], { nullable: true })
  members?: TokenOwner[];
}

import { Field, ObjectType } from '@nestjs/graphql';
import type { Realm as IRealm } from '@gilderlabs/types';
import { TokenOwner } from './token-owner.model';
import { Proposal } from './proposal.model';
import { Governance } from './governance.model';

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

  @Field(() => [Governance], { nullable: true })
  governances?: TokenOwner[];

  @Field(() => [TokenOwner], { nullable: true })
  members?: TokenOwner[];
}

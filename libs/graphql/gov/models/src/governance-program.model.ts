import { Field, ObjectType } from '@nestjs/graphql';
import { Realm } from './realm.model';

@ObjectType()
export class GovernanceProgram {
  @Field()
  governanceProgramPk: string;

  @Field(() => [Realm], { nullable: true })
  realms?: Realm[];
}

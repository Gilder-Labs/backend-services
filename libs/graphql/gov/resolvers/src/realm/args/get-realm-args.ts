import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetRealmArgs {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  realmPk?: string;
}

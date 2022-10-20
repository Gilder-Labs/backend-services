import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetProgramsArgs {
  @Field(() => [String])
  governanceProgramPks!: string[];
}

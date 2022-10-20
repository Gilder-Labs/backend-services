import { Realm, GovernanceProgram } from '@gilder/graphql-gov-models';
import { IDataLoaders } from '@gilder/graphql-gov-dataloaders';
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProgramsArgs } from './args/get-programs-args';

@Resolver(GovernanceProgram)
export class GovernanceProgramResolver {
  @InjectRepository(Realm)
  private readonly realmRepo!: Repository<Realm>;

  @Query(() => [GovernanceProgram])
  async governancePrograms(): Promise<GovernanceProgram[]> {
    const uniquePrograms = await this.realmRepo
      .createQueryBuilder('realm')
      .select(['realm.programPk'])
      .distinctOn(['realm.programPk'])
      .getMany();
    return uniquePrograms.map<GovernanceProgram>((x) => ({
      governanceProgramPk: x.programPk,
    }));
  }

  @Query(() => [GovernanceProgram], { nullable: true })
  async getGovernancePrograms(
    @Args() { governanceProgramPks }: GetProgramsArgs,
  ) {
    const uniquePrograms = await this.realmRepo
      .createQueryBuilder('realm')
      .select(['realm.programPk'])
      .where('realm.programPk IN(:...pks)', { pks: governanceProgramPks })
      .getMany();
    return uniquePrograms.map<GovernanceProgram>((x) => ({
      governanceProgramPk: x.programPk,
    }));
  }

  @ResolveField('realms', () => [Realm])
  async realms(
    @Parent() governanceProgram: GovernanceProgram,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<Realm[]> {
    const { governanceProgramPk } = governanceProgram;
    return loaders.realmsLoader.load(governanceProgramPk);
  }
}

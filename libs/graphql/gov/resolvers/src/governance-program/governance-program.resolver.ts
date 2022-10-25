import {
  Realm,
  GovernanceProgram,
  Proposal,
  ProposalTransaction,
  VoteRecord,
  SignatoryRecord,
  Governance,
  TokenOwner,
} from '@gilder/graphql-gov-models';
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
import { distinctBy } from '@gilder/utilities';

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
    return loaders.getRealmsByProgramPk.load(governanceProgramPk);
  }

  @ResolveField('governances', () => [Governance])
  async governances(
    @Parent() governanceProgram: GovernanceProgram,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<Governance[]> {
    const { governanceProgramPk } = governanceProgram;
    return loaders.getGovernancesByProgramPk.load(governanceProgramPk);
  }

  @ResolveField('tokenOwners', () => [TokenOwner])
  async tokenOwners(
    @Parent() governanceProgram: GovernanceProgram,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<TokenOwner[]> {
    const { governanceProgramPk } = governanceProgram;
    const tokenOwners = await loaders.getTokenOwnersByProgramPk.load(
      governanceProgramPk,
    );
    return distinctBy(tokenOwners, (x) => x.ownerPk);
  }

  @ResolveField('proposals', () => [Proposal])
  async proposals(
    @Parent() governanceProgram: GovernanceProgram,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<Proposal[]> {
    const { governanceProgramPk } = governanceProgram;
    return loaders.getProposalsByProgramPk.load(governanceProgramPk);
  }

  @ResolveField('signatoryRecords', () => [SignatoryRecord])
  async signatoryRecords(
    @Parent() governanceProgram: GovernanceProgram,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<SignatoryRecord[]> {
    const { governanceProgramPk } = governanceProgram;
    return loaders.getSignatoryRecordByProgramPk.load(governanceProgramPk);
  }

  @ResolveField('voteRecords', () => [VoteRecord])
  async voteRecords(
    @Parent() governanceProgram: GovernanceProgram,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<VoteRecord[]> {
    const { governanceProgramPk } = governanceProgram;
    return loaders.getVoteRecordsByProgramPk.load(governanceProgramPk);
  }

  @ResolveField('proposalTransactions', () => [ProposalTransaction])
  async proposalTransactions(
    @Parent() governanceProgram: GovernanceProgram,
    @Context() { loaders }: { loaders: IDataLoaders },
  ): Promise<ProposalTransaction[]> {
    const { governanceProgramPk } = governanceProgram;
    return loaders.getProposalTransactionsByProgramPk.load(governanceProgramPk);
  }
}

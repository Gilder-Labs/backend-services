import { Proposal } from '@gilder/gov-db-entities';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ProposalsService } from './proposals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal])],
  providers: [ProposalsService],
  exports: [ProposalsService],
})
export class ProposalsServiceModule {
  static register(dataSource?: string): DynamicModule {
    const provider: Provider<any> = {
      provide: 'PROPOSAL_SERVICE',
      useFactory: (repo) => new ProposalsService(repo),
      inject: [getRepositoryToken(Proposal, dataSource)],
    };
    return {
      module: ProposalsServiceModule,
      imports: [TypeOrmModule.forFeature([Proposal], dataSource)],
      providers: [provider],
      exports: [provider],
    };
  }
}

import { Governance } from '@gilder/gov-db-entities';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { GovernancesService } from './governances.service';

@Module({
  imports: [TypeOrmModule.forFeature([Governance])],
  providers: [GovernancesService],
  exports: [GovernancesService],
})
export class GovernancesServiceModule {
  static register(dataSource?: string): DynamicModule {
    const provider: Provider<any> = {
      provide: 'GOVERNANCE_PROVIDER',
      useFactory: (repo) => new GovernancesService(repo),
      inject: [getRepositoryToken(Governance, dataSource)],
    };
    return {
      module: GovernancesServiceModule,
      imports: [TypeOrmModule.forFeature([Governance], dataSource)],
      providers: [provider],
      exports: [provider],
    };
  }
}

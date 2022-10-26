import { VoteRecord } from '@gilder/gov-db-entities';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { VoteRecordsService } from './vote-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([VoteRecord])],
  providers: [VoteRecordsService],
  exports: [VoteRecordsService],
})
export class VoteRecordsServiceModule {
  static register(dataSource?: string): DynamicModule {
    const provider: Provider<any> = {
      provide: 'VOTE_RECORD_SERVICE',
      useFactory: (repo) => new VoteRecordsService(repo),
      inject: [getRepositoryToken(VoteRecord, dataSource)],
    };
    return {
      module: VoteRecordsServiceModule,
      imports: [TypeOrmModule.forFeature([VoteRecord], dataSource)],
      providers: [provider],
      exports: [provider],
    };
  }
}

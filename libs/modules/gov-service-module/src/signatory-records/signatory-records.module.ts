import { SignatoryRecord } from '@gilder/gov-db-entities';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { SignatoryRecordsService } from './signatory-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([SignatoryRecord])],
  providers: [SignatoryRecordsService],
  exports: [SignatoryRecordsService],
})
export class SignatoryRecordsServiceModule {
  static register(dataSource?: string): DynamicModule {
    const provider: Provider<any> = {
      provide: 'SIGNATORY_RECORD_SERVICE',
      useFactory: (repo) => new SignatoryRecordsService(repo),
      inject: [getRepositoryToken(SignatoryRecord, dataSource)],
    };
    return {
      module: SignatoryRecordsServiceModule,
      imports: [TypeOrmModule.forFeature([SignatoryRecord], dataSource)],
      providers: [provider],
      exports: [provider],
    };
  }
}

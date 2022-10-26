import { Realm } from '@gilder/gov-db-entities';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { RealmsRestService } from './realms.rest-service';
import { RealmsService } from './realms.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Realm])],
  providers: [RealmsRestService, RealmsService],
  exports: [RealmsRestService, RealmsService],
})
export class RealmsServiceModule {
  static register(dataSource?: string): DynamicModule {
    const provider: Provider<any> = {
      provide: 'REALM_SERVICE',
      useFactory: (repo) => new RealmsService(repo),
      inject: [getRepositoryToken(Realm, dataSource)],
    };
    return {
      module: RealmsServiceModule,
      imports: [TypeOrmModule.forFeature([Realm], dataSource)],
      providers: [provider],
      exports: [provider],
    };
  }
}

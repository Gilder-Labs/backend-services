import { Module } from '@nestjs/common';
import { GovernanceProgramResolver } from './governance-program.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Realm } from '@gilder/gov-db-entities';
import { GovServiceModule } from '@gilder/gov-service-module';

@Module({
  imports: [GovServiceModule, TypeOrmModule.forFeature([Realm])],
  providers: [GovernanceProgramResolver],
  exports: [GovernanceProgramResolver],
})
export class GovernanceProgramsGraphQLModule {}

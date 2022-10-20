import { Module } from '@nestjs/common';
import { GovernanceProgramResolver } from './governance-program.resolver';
import { RealmsModule } from '@gilder/realms-module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Realm } from '@gilder/gov-db-entities';

@Module({
  imports: [RealmsModule, TypeOrmModule.forFeature([Realm])],
  providers: [GovernanceProgramResolver],
  exports: [GovernanceProgramResolver],
})
export class GovernanceProgramsGraphQLModule {}

import { Module } from '@nestjs/common';
import { GovernancesResolver } from './governance.resolver';
import { Governance, Proposal } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GovernancesServiceModule,
  GovernancesService,
} from '@gilder/governances-module';

@Module({
  imports: [TypeOrmModule.forFeature([Governance]), GovernancesServiceModule],
  providers: [GovernancesService, GovernancesResolver],
  exports: [GovernancesResolver],
})
export class GovernancesGraphQLModule {}

import { Module } from '@nestjs/common';
import { GovernancesResolver } from './governance.resolver';
import { Governance, Proposal } from '@gilder/gov-db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovServiceModule } from '@gilder/gov-service-module';

@Module({
  imports: [TypeOrmModule.forFeature([Governance]), GovServiceModule],
  providers: [GovernancesResolver],
  exports: [GovernancesResolver],
})
export class GovernancesGraphQLModule {}

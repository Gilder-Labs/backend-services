import { Governance } from '@gilder/db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernancesService } from './governances.service';

@Module({
  imports: [TypeOrmModule.forFeature([Governance])],
  providers: [GovernancesService],
  exports: [GovernancesService],
})
export class GovernancesServiceModule {}

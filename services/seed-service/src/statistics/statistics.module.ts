import { CalculatedStatistic } from '@gilder/gov-db-entities';
import { GovServiceModule } from '@gilder/gov-service-module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [GovServiceModule, TypeOrmModule.forFeature([CalculatedStatistic])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}

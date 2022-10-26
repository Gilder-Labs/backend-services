import { CalculatedStatistic } from '@gilder/gov-db-entities';
import { GovServiceModule } from '@gilder/gov-service-module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DEVNET_DB } from 'src/utils/constants';
import { DevnetStatisticsController } from './devnet-statistics.controller';
import { DevnetStatisticsService } from './devnet-statistics.service';

@Module({
  imports: [
    GovServiceModule.register(DEVNET_DB),
    TypeOrmModule.forFeature([CalculatedStatistic], DEVNET_DB),
  ],
  controllers: [DevnetStatisticsController],
  providers: [DevnetStatisticsService],
})
export class DevnetStatisticsModule {}

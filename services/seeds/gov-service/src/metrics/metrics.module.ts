import { Metric } from '@gilder/gov-db-entities';
import { GovServiceModule } from '@gilder/gov-service-module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [GovServiceModule, TypeOrmModule.forFeature([Metric])],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}

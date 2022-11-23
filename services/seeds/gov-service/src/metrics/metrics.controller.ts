import { Metric } from '@gilder/gov-db-entities';
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller({
  path: 'metrics',
})
export class MetricsController {
  @InjectRepository(Metric)
  private readonly metricRepo: Repository<Metric>;

  @Get()
  getStatistics() {
    return this.metricRepo.find();
  }
}

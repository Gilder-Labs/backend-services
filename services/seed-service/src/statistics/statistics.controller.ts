import { CalculatedStatistic } from '@gilder/gov-db-entities';
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller({
  path: 'statistics',
})
export class StatisticsController {
  @InjectRepository(CalculatedStatistic)
  private readonly statisticsRepo: Repository<CalculatedStatistic>;

  @Get()
  getStatistics() {
    return this.statisticsRepo.find();
  }
}

import { CalculatedStatistic } from '@gilder/gov-db-entities';
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEVNET_DB } from '../utils/constants';
import { Repository } from 'typeorm';

@Controller({
  path: 'devnet',
})
export class DevnetStatisticsController {
  @InjectRepository(CalculatedStatistic, DEVNET_DB)
  private readonly statisticsRepo: Repository<CalculatedStatistic>;

  @Get('statistics')
  getStatistics() {
    return this.statisticsRepo.find();
  }
}

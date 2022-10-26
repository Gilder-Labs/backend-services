import { Controller, Inject, Logger } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller({
  path: 'seed',
})
export class StatisticsController {
  private readonly logger = new Logger(StatisticsController.name);

  @Inject(StatisticsService)
  private readonly statisticsService: StatisticsService;
}

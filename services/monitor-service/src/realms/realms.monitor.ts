import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RealmsService } from './realms.service';

@Injectable()
export class RealmsMonitorService {
  private readonly logger = new Logger(RealmsMonitorService.name);

  constructor(private readonly realmsService: RealmsService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async addOrUpdateRealms() {}
}

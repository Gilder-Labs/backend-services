import { RealmsRPCService, RealmsService } from '@gilder/realms-module';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RealmsMonitorService {
  private readonly logger = new Logger(RealmsMonitorService.name);

  constructor(
    private readonly realmsService: RealmsService,
    private readonly realmsRpcService: RealmsRPCService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async addOrUpdateRealms() {
    const realms = await this.realmsRpcService.getAllRealmsFromSolana();
    this.logger.log(`Discovered ${realms.length} realms...`);
    await this.realmsService.addOrUpdateRealms(realms);
  }
}

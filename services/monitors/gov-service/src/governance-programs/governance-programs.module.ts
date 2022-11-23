import { GovServiceModule } from '@gilder/gov-service-module';
import { Module } from '@nestjs/common';
import { GovernanceProgramsMonitorService } from './governance-programs.monitor';

@Module({
  imports: [GovServiceModule],
  providers: [GovernanceProgramsMonitorService],
})
export class GovernanceProgramsMonitorModule {}

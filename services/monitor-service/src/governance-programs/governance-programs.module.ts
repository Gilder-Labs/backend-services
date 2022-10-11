import { Module } from '@nestjs/common';
import { GovernanceProgramsMonitorService } from './governance-programs.monitor';

@Module({
  imports: [],
  providers: [GovernanceProgramsMonitorService],
})
export class GovernanceProgramsMonitorModule {}

import { GovernancesServiceModule } from '@gilder/governances-module';
import { ProposalsModule } from '@gilder/proposals-module';
import { RealmsModule } from '@gilder/realms-module';
import { Module } from '@nestjs/common';
import { GovernanceProgramsMonitorService } from './governance-programs.monitor';

@Module({
  imports: [RealmsModule, GovernancesServiceModule, ProposalsModule],
  providers: [GovernanceProgramsMonitorService],
})
export class GovernanceProgramsMonitorModule {}

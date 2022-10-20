import { GovernancesServiceModule } from '@gilder/governances-module';
import { ProposalsModule } from '@gilder/proposals-module';
import { RealmsModule } from '@gilder/realms-module';
import { TokenOwnersServiceModule } from '@gilder/token-owners-module';
import { Module } from '@nestjs/common';
import { GovernanceProgramsMonitorService } from './governance-programs.monitor';

@Module({
  imports: [
    RealmsModule,
    GovernancesServiceModule,
    ProposalsModule,
    TokenOwnersServiceModule,
  ],
  providers: [GovernanceProgramsMonitorService],
})
export class GovernanceProgramsMonitorModule {}

import { Module } from '@nestjs/common';
import { GovernanceProgramResolver } from './governance-program.resolver';
import { RealmsModule, RealmsRestService } from '@gilder/realms-module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, RealmsModule],
  providers: [RealmsRestService, GovernanceProgramResolver],
  exports: [GovernanceProgramResolver],
})
export class GovernanceProgramsGraphQLModule {}

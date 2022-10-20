import { Module } from '@nestjs/common';
import { TokenOwnersServiceModule } from '@gilder/token-owners-module';
import { DataLoaderService } from './dataloader.service';
import { ProposalsModule } from '@gilder/proposals-module';
import { GovernancesServiceModule } from '@gilder/governances-module';
import { RealmsModule } from '@gilder/realms-module';

@Module({
  imports: [
    TokenOwnersServiceModule,
    ProposalsModule,
    GovernancesServiceModule,
    RealmsModule,
  ],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class DataLoaderModule {}

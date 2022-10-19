import { Module } from '@nestjs/common';
import { TokenOwnersServiceModule } from '@gilder/token-owners-module';
import { DataLoaderService } from './dataloader.service';
import { ProposalsModule } from '@gilder/proposals-module';
import { GovernancesServiceModule } from '@gilder/governances-module';

@Module({
  imports: [
    TokenOwnersServiceModule,
    ProposalsModule,
    GovernancesServiceModule,
  ],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class DataLoaderModule {}

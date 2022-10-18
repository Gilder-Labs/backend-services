import { Module } from '@nestjs/common';
import { TokenOwnersServiceModule } from '@gilder/token-owners-module';
import { DataLoaderService } from './dataloader.service';
import { ProposalsModule } from '@gilder/proposals-module';

@Module({
  imports: [TokenOwnersServiceModule, ProposalsModule],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class DataLoaderModule {}

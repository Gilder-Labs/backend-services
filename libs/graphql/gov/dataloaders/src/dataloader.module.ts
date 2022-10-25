import { Module } from '@nestjs/common';
import { DataLoaderService } from './dataloader.service';
import { GovServiceModule } from '@gilder/gov-service-module';

@Module({
  imports: [GovServiceModule],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class DataLoaderModule {}

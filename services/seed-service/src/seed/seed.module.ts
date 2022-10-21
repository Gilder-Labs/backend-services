import { GovServiceModule } from '@gilder/gov-service-module';
import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [GovServiceModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}

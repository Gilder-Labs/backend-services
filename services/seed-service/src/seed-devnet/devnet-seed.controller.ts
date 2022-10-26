import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Logger,
} from '@nestjs/common';
import { DevnetSeedService } from './devnet-seed.service';

@Controller({
  path: 'devnet',
})
export class DevnetSeedController {
  private readonly logger = new Logger(DevnetSeedController.name);

  @Inject(DevnetSeedService)
  private readonly seedService: DevnetSeedService;

  @Get('seed')
  async triggerSeed() {
    try {
      if (this.seedService.isSeeding) {
        return {
          message: 'Seeding already in progress',
        };
      }

      await this.seedService.seedDatabase();
      return {
        message: 'Successfully seeded',
      };
    } catch (e) {
      this.logger.error(`Something went wrong. Error: ${e}`);
      throw new BadRequestException();
    }
  }
}

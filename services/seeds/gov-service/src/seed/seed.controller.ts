import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Logger,
} from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller({
  path: 'seed',
})
export class SeedController {
  private readonly logger = new Logger(SeedController.name);

  @Inject(SeedService)
  private readonly seedService: SeedService;

  @Get()
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
      throw new BadRequestException();
    }
  }
}

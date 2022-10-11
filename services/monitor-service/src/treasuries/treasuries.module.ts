import { TOKEN_OWNER_QUEUE } from '@gilder/constants';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreasuriesProcessor } from './treasuries.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    BullModule.registerQueue({
      name: TOKEN_OWNER_QUEUE,
    }),
  ],
  providers: [TreasuriesProcessor],
})
export class TreasuriesModule {}

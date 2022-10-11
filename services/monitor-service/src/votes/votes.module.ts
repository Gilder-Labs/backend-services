import { VOTES_QUEUE } from '@gilder/constants';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesProcessor } from './votes.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    BullModule.registerQueue({
      name: VOTES_QUEUE,
    }),
  ],
  providers: [VotesProcessor],
})
export class VotesModule {}

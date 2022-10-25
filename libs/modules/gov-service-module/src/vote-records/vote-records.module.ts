import { VoteRecord } from '@gilder/gov-db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteRecordsService } from './vote-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([VoteRecord])],
  providers: [VoteRecordsService],
  exports: [VoteRecordsService],
})
export class VoteRecordsServiceModule {}

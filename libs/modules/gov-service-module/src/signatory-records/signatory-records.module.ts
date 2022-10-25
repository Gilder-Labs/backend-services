import { SignatoryRecord } from '@gilder/gov-db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignatoryRecordsService } from './signatory-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([SignatoryRecord])],
  providers: [SignatoryRecordsService],
  exports: [SignatoryRecordsService],
})
export class SignatoryRecordsServiceModule {}

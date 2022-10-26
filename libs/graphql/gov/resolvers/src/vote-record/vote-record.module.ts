import { Module } from '@nestjs/common';
import { VoteRecordResolver } from './vote-record.resolver';
import { VoteRecord } from '@gilder/gov-db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GovServiceModule,
  VoteRecordsService,
} from '@gilder/gov-service-module';

@Module({
  imports: [TypeOrmModule.forFeature([VoteRecord]), GovServiceModule],
  providers: [VoteRecordsService, VoteRecordResolver],
  exports: [VoteRecordResolver],
})
export class VoteRecordsGraphQLModule {}

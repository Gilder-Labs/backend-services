import { Module } from '@nestjs/common';
import { SignatoryRecordResolver } from './signatory-record.resolver';
import { SignatoryRecord } from '@gilder/gov-db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GovServiceModule,
  SignatoryRecordsService,
} from '@gilder/gov-service-module';

@Module({
  imports: [TypeOrmModule.forFeature([SignatoryRecord]), GovServiceModule],
  providers: [SignatoryRecordsService, SignatoryRecordResolver],
  exports: [SignatoryRecordResolver],
})
export class SignatoryRecordsGraphQLModule {}

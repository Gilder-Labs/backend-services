import { Realm } from '@gilder/gov-db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsRestService } from './realms.rest-service';
import { RealmsService } from './realms.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Realm])],
  providers: [RealmsRestService, RealmsService],
  exports: [RealmsRestService, RealmsService],
})
export class RealmsServiceModule {}

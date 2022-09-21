import { Realm } from '@gilder/db-entities';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsMonitorService } from './realms.monitor';
import { RealmsRestService } from './realms.rest-service';
import { RealmsService } from './realms.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Realm])],
  controllers: [],
  providers: [RealmsService, RealmsRestService, RealmsMonitorService],
  exports: [RealmsService],
})
export class RealmsModule {}

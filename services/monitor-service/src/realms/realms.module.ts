import { Realm } from '@gilder/db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsMonitorService } from './realms.monitor';
import { RealmsRestService } from './realms.rest-service';
import { RealmsService } from './realms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Realm])],
  controllers: [],
  providers: [RealmsService, RealmsRestService, RealmsMonitorService],
  exports: [RealmsService],
})
export class RealmsModule {}

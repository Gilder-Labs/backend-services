import { Realm } from '@gilder/db-entities';
import { RealmsModule } from '@gilder/realms-module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsMonitorService } from './realms.monitor';

@Module({
  imports: [HttpModule, RealmsModule, TypeOrmModule.forFeature([Realm])],
  controllers: [],
  providers: [RealmsMonitorService],
})
export class RealmsMonitorModule {}

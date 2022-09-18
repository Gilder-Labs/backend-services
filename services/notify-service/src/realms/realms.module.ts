import { Realm } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RealmsController } from './realms.controller';
import { RealmsService } from './realms.service';
import { RealmsRestService } from './realms.rest-service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, HttpModule, TypeOrmModule.forFeature([Realm])],
  providers: [RealmsService, RealmsRestService],
  controllers: [RealmsController],
  exports: [RealmsService],
})
export class RealmsModule {}

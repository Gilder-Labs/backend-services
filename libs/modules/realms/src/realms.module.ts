import { Realm } from '@gilder/gov-db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsRestService } from './realms.rest-service';
import { RealmsService } from './realms.service';
import { RealmsRPCService } from './realms.rpc-service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Realm])],
  providers: [RealmsRestService, RealmsRPCService, RealmsService],
  exports: [RealmsRestService, RealmsRPCService, RealmsService],
})
export class RealmsModule {}

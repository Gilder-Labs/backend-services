import { Realm } from '@gilder/db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsService } from './realms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Realm])],
  providers: [RealmsService],
  exports: [RealmsService],
})
export class RealmsModule {}

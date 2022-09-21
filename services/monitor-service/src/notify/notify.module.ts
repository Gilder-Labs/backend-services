import { NotificationSubscription } from '@gilder/db-entities';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyService } from './notify.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([NotificationSubscription])],
  controllers: [],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}

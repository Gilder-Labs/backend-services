import { NOTIFICATION_QUEUE } from '@gilder/constants';
import { NotificationSubscription } from '@gilder/db-entities';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationProcessor } from './notifications.processor';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([NotificationSubscription]),
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
    }),
  ],
  providers: [NotificationsService, NotificationProcessor],
})
export class NotificationsModule {}

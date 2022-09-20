import { NotificationSubscription, Realm } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Realm, NotificationSubscription])],
  providers: [NotificationService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}

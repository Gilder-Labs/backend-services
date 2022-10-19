import { NotificationSubscription, Proposal } from '@gilder/gov-db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationSubscriptionsService } from './notification-subscriptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationSubscription])],
  providers: [NotificationSubscriptionsService],
  exports: [NotificationSubscriptionsService],
})
export class NotificationSubscriptionsModule {}

import { NotificationSubscription, Realm } from '@gilder/gov-db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { ConfigModule } from '@nestjs/config';
import { NotificationSubscriptionsModule } from '@gilder/notification-subscriptions-module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Realm, NotificationSubscription]),
    NotificationSubscriptionsModule,
  ],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}

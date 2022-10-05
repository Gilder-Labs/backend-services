import { NotificationSubscription, Realm } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import {
  MONITOR_SERVICE,
  NotificationSubscriptionsModule,
} from '@gilder/notification-subscriptions-module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Realm, NotificationSubscription]),
    BullModule.registerQueue({
      name: 'notification',
    }),
    NotificationSubscriptionsModule,
  ],
  providers: [
    {
      provide: MONITOR_SERVICE,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow('MONITOR_SERVICE_HOST'),
            port: configService.getOrThrow<number>('MONITOR_SERVICE_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [NotificationsController],
})
export class NotificationsModule {}

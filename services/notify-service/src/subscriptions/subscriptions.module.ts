import { NotificationSubscription, Realm } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { NotificationSubscriptionsModule } from '@gilder/notification-subscriptions-module';
import { MONITOR_SERVICE } from '@gilder/constants';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Realm, NotificationSubscription]),
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
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}

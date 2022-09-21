import { NotificationSubscription, Realm } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationsController } from './notifications.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MONITOR_SERVICE } from './constants';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Realm, NotificationSubscription]),
  ],
  providers: [
    NotificationService,
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

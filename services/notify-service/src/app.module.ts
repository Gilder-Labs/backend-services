import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { getDataConfig } from './data-source';
import { NotificationsModule } from './notifications';
import { SubscriptionsModule } from './subscriptions';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
        redact: ['req.headers'],
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: true,
            singleLine: true,
            ignore: 'pid,hostname',
          },
        },
      },
    }),
    ConfigModule.forRoot({ envFilePath: ['.env.local', '.env'] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDataConfig(configService),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.getOrThrow('QUEUE_HOST'),
          port: configService.get<number>('QUEUE_PORT') ?? 6379,
          username: configService.get<string>('QUEUE_USER'),
          password: configService.get<string>('QUEUE_PASS'),
          tls: configService.get<boolean>('QUEUE_USE_SSL')
            ? { rejectUnauthorized: false }
            : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    SubscriptionsModule,
    NotificationsModule,
  ],
})
export class AppModule {}

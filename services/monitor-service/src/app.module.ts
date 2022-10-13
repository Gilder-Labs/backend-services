import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { getDataConfig } from './data-source';
import { ScheduleModule } from '@nestjs/schedule';
import { RealmsMonitorModule } from './realms';
import { ProposalsMonitorModule } from './proposals';
import { TokenOwnersModule } from './token-owners/token-owners.module';
import { BullModule } from '@nestjs/bull';
import { GovernanceModule } from './governances';
import { RpcManagerModule } from '@gilder/rpc-manager-module';

@Module({
  imports: [
    RpcManagerModule.forRoot([
      {
        rps: 25,
        uri: 'https://ssc-dao.genesysgo.net/',
      },
    ]),
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
    ScheduleModule.forRoot(),
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
          tls:
            configService.get<Environment>('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    // RealmsMonitorModule,
    ProposalsMonitorModule,
    // TokenOwnersModule,
    // GovernanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

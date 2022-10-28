import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { getDataConfig } from './data-source';
import { SeedModule } from './seed';
import { MetricsModule } from './metrics';
import { DEFAULT_CONNECTION } from './utils/constants';
import { RpcManagerModule } from '@gilder/connection-manager-module';

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
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: ['.env.local', '.env'] }),
    RpcManagerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const defaultUrls = configService.get<string>('RPC_URLS').split(';');
        return {
          [DEFAULT_CONNECTION]: defaultUrls.map((x) => ({
            rps: 25,
            uri: x,
          })),
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDataConfig(configService),
    }),

    SeedModule,
    MetricsModule,
  ],
})
export class AppModule {}

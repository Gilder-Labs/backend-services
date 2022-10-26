import { RpcManagerModule } from '@gilder/rpc-manager-module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { getDataConfig } from './data-source';
import { getDevnetDataConfig } from './dev-data-source';
import { SeedModule } from './seed';
import { DevnetSeedModule } from './seed-devnet';
import { StatisticsModule } from './statistics';
import { DevnetStatisticsModule } from './statistics-devnet';
import { DEFAULT_CONNECTION, DEVNET_CONNECTION } from './utils/constants';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDataConfig(configService),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'devnet',
      useFactory: (configService: ConfigService) =>
        getDevnetDataConfig(configService),
    }),
    RpcManagerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const defaultUrls = configService.get<string>('RPC_URLS').split(';');
        const devnetUrls = configService
          .get<string>('DEVNET_RPC_URLS')
          .split(';');
        return {
          [DEFAULT_CONNECTION]: defaultUrls.map((x) => ({
            rps: 25,
            uri: x,
          })),
          [DEVNET_CONNECTION]: devnetUrls.map((x) => ({
            rps: 25,
            uri: x,
          })),
        };
      },
    }),
    SeedModule,
    DevnetSeedModule,
    StatisticsModule,
    DevnetStatisticsModule,
  ],
})
export class AppModule {}

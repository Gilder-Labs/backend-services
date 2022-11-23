import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { getDataConfig } from './data-source';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  DataLoaderModule,
  DataLoaderService,
} from '@gilder/graphql-gov-dataloaders';
import { SandboxMonitorService } from './sandbox.monitor';
import { RpcManagerModule } from '@gilder/connection-manager-module';
import { DEFAULT_CONNECTION, WS_CONNECTION } from './utils/constants';

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
    RpcManagerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const defaultUrls = configService.get<string>('RPC_URLS').split(';');
        const wsUrls = configService.get<string>('WS_RPC_URLS').split(';');
        return {
          [DEFAULT_CONNECTION]: defaultUrls.map((x) => ({
            rps: 25,
            uri: x,
          })),
          [WS_CONNECTION]: wsUrls.map((x) => ({
            rps: 25,
            uri: x,
          })),
        };
      },
    }),
  ],
  providers: [SandboxMonitorService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { getDataConfig } from './data-source';
import { RealmsModule } from './realms/realms.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { DialectSdk } from './dialect-sdk';
import {
  Dialect,
  Environment,
  NodeDialectWalletAdapter,
  DialectWalletAdapterWrapper,
  SolanaNetwork,
  Backend,
  TokenStore,
  EncryptionKeysStore,
} from '@dialectlabs/sdk';
import { ScheduleModule } from '@nestjs/schedule';
import { NewProposalsMonitoringService } from './monitors';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: !import.meta.env.PROD,
        redact: ['req.headers'],
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: import.meta.env.DEV,
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
    RealmsModule,
  ],
  controllers: [HealthController],
  providers: [NewProposalsMonitoringService],
})
export class AppModule {}

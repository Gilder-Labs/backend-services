import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { getDataConfig } from './data-source';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { RealmsMonitorService, ProposalsMonitorService } from './monitors';
import { RealmsRestService } from './rest-services';
import { NotificationSubscription, Proposal, Realm } from '@gilder/db-entities';

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
    TypeOrmModule.forFeature([Realm, Proposal, NotificationSubscription]),
  ],
  controllers: [HealthController],
  providers: [RealmsRestService, RealmsMonitorService, ProposalsMonitorService],
})
export class AppModule {}

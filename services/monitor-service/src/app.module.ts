import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { getDataConfig } from './data-source';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { RealmsModule } from './realms';
import { ProposalsModule } from './proposals';

@Module({
  imports: [
    TerminusModule,
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: process.env.ENV !== 'production',
        redact: ['req.headers'],
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: process.env.ENV === 'development',
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
    ProposalsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDataConfig } from './data-source';
import { RealmsModule } from './realms/realms.module';

@Module({
  imports: [
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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDataConfig(configService),
    }),
    RealmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

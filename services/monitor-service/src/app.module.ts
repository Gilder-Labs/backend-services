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
import {
  DEFAULT_CONNECTION,
  PROPOSAL_CONNECTION,
  WS_CONNECTION,
} from './utils/constants';
import { GovernanceProgramsMonitorModule } from './governance-programs';

@Module({
  imports: [
    RpcManagerModule.forRoot({
      [DEFAULT_CONNECTION]: [
        {
          rps: 90,
          uri: 'https://necessary-winter-county.solana-mainnet.quiknode.pro/7ea512375c985ba68369cc9526c64a88ee27992a/',
        },
        {
          rps: 90,
          uri: 'https://little-summer-emerald.solana-mainnet.quiknode.pro/1a5b112d72ed9c2218e8b295874cb90a21c34046/',
        },
      ],
      [WS_CONNECTION]: [
        {
          rps: 90,
          uri: 'https://tame-muddy-sea.solana-mainnet.quiknode.pro/1327f052cbc7dccfd47167de37c061f1abfb2e99/',
        },
        {
          rps: 90,
          uri: 'https://divine-powerful-bush.solana-mainnet.quiknode.pro/69aba9a17165369f035b916f40e85b29c1657e70/',
        },
      ],
      [PROPOSAL_CONNECTION]: [
        {
          rps: 90,
          uri: 'https://chaotic-ultra-aura.solana-mainnet.quiknode.pro/cb9855dc402f5ab8bc7bf2e180993433317bc28b/',
        },
      ],
    }),
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
    GovernanceProgramsMonitorModule,
    // RealmsMonitorModule,
    // ProposalsMonitorModule,
    // TokenOwnersModule,
    // GovernanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

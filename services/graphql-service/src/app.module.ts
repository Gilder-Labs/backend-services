import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { getDataConfig } from './data-source';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  ProposalsGraphQLModule,
  RealmsGraphQLModule,
  GovernanceProgramsGraphQLModule,
  TokenOwnersGraphQLModule,
  GovernancesGraphQLModule,
} from '@gilder/graphql-resolvers';
import {
  DataLoaderModule,
  DataLoaderService,
} from '@gilder/graphql-dataloaders';

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
    RealmsGraphQLModule,
    ProposalsGraphQLModule,
    GovernanceProgramsGraphQLModule,
    TokenOwnersGraphQLModule,
    GovernancesGraphQLModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule, DataLoaderModule],
      inject: [ConfigService, DataLoaderService],
      useFactory: (
        configService: ConfigService,
        dataLoaderService: DataLoaderService,
      ) => ({
        autoSchemaFile: true,
        cache: 'bounded',
        installSubscriptionHandlers: true,
        debug: configService.get<boolean>('DEBUG'),
        context: () => ({
          loaders: dataLoaderService.getLoaders(),
        }),
        subscriptions: {
          'graphql-ws': true,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

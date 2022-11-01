import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { getDataConfig } from './data-source';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GovResolversModule } from '@gilder/graphql-gov-resolvers';
import {
  DataLoaderModule,
  DataLoaderService,
} from '@gilder/graphql-gov-dataloaders';
import { join } from 'path';

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
    GovResolversModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule, DataLoaderModule],
      inject: [ConfigService, DataLoaderService],
      useFactory: (
        configService: ConfigService,
        dataLoaderService: DataLoaderService,
      ) => ({
        introspection: configService.get<boolean>('ALLOW_INTROSPECTION'),
        playground: configService.get<boolean>('ALLOW_PLAYGROUND'),
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
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
})
export class AppModule {}

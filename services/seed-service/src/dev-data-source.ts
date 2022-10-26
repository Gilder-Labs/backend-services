import {
  CalculatedStatistic,
  Governance,
  Proposal,
  ProposalTransaction,
  Realm,
  SignatoryRecord,
  TokenOwner,
  VoteRecord,
} from '@gilder/gov-db-entities';
import { ConfigService } from '@nestjs/config';
import 'reflect-metadata';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const getDevnetDataConfig = (
  configService: ConfigService,
): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    host: configService.getOrThrow<string>('DEV_DB_HOST'),
    username: configService.getOrThrow('DEV_DB_USERNAME'),
    password: configService.getOrThrow('DEV_DB_PASSWORD'),
    database: configService.getOrThrow('DEV_DB_NAME'),
    port: configService.getOrThrow<number>('DEV_DB_PORT'),
    ssl: configService.get<boolean>('USE_SSL')
      ? {
          rejectUnauthorized: false,
        }
      : false,
    synchronize: true,
    entities: [
      Realm,
      Proposal,
      TokenOwner,
      Governance,
      SignatoryRecord,
      ProposalTransaction,
      VoteRecord,
      CalculatedStatistic,
    ],
    migrations: [],
    subscribers: [],
  };
};

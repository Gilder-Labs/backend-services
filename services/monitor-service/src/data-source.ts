import {
  Governance,
  NotificationSubscription,
  Proposal,
  Realm,
  TokenOwner,
} from '@gilder/db-entities';
import { ConfigService } from '@nestjs/config';
import 'reflect-metadata';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const getDataConfig = (
  configService: ConfigService,
): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    host: configService.getOrThrow<string>('DB_HOST'),
    username: configService.getOrThrow('DB_USERNAME'),
    password: configService.getOrThrow('DB_PASSWORD'),
    database: configService.getOrThrow('DB_NAME'),
    port: configService.getOrThrow<number>('DB_PORT'),
    ssl:
      configService.getOrThrow<Environment>('NODE_ENV') !== 'production'
        ? false
        : {
            rejectUnauthorized: false,
          },
    entities: [
      Realm,
      Proposal,
      TokenOwner,
      Governance,
      NotificationSubscription,
    ],
    migrations: [],
    subscribers: [],
  };
};

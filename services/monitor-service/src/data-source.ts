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
  const host = configService.getOrThrow<string>('DB_HOST');
  const isLocalhost = host.includes('localhost');
  return {
    type: 'postgres',
    host,
    username: configService.getOrThrow('DB_USERNAME'),
    password: configService.getOrThrow('DB_PASSWORD'),
    database: configService.getOrThrow('DB_NAME'),
    port: configService.getOrThrow<number>('DB_PORT'),
    ssl: isLocalhost
      ? false
      : {
          rejectUnauthorized: false,
        },
    synchronize:
      configService.getOrThrow<Environment>('NODE_ENV') === 'development',
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

// import { NotificationSubscription, Proposal, Realm } from '@gilder/db-entities';
import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import 'reflect-metadata';
import { Proposal, Realm } from '@gilder/db-entities';

export const getDataConfig = (
  configService: ConfigService,
): PostgresConnectionOptions => ({
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  username: configService.getOrThrow('DB_USERNAME'),
  password: configService.getOrThrow('DB_PASSWORD'),
  database: configService.getOrThrow('DB_NAME'),
  port: configService.getOrThrow<number>('DB_PORT'),
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  entities: [Realm, Proposal],
  migrations: [],
  subscribers: [],
});

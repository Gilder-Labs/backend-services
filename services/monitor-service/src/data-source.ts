import { Realm } from '@gilder/db-entities';
import { ConfigService } from '@nestjs/config';
import 'reflect-metadata';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

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
  entities: [Realm],
  migrations: [],
  subscribers: [],
});

import { Realm } from '@gilder/db-entities';
import 'reflect-metadata';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export const dataConfig: SqliteConnectionOptions = {
  type: 'sqlite',
  database: '../test.db',
  synchronize: true,
  entities: [Realm],
  migrations: [],
  subscribers: [],
};

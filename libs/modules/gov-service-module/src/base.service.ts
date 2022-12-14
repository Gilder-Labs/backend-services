import {
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { BaseGovEntity } from '@gilder/gov-db-entities';
import { ProgramAccount } from '@solana/spl-governance';
import { chunkArray } from '@gilder/utilities';

export abstract class BaseService<
  TEntity extends BaseGovEntity & ObjectLiteral,
  TSolanaEntity,
> {
  public getBy(
    where: FindOptionsWhere<TEntity>,
    select?: FindOptionsSelect<TEntity>,
  ): Promise<TEntity | null> {
    return this.getRepo().findOne({ where, select });
  }

  public filterBy(
    where: FindOptionsWhere<TEntity>,
    select?: FindOptionsSelect<TEntity>,
  ): Promise<TEntity[]> {
    return this.getRepo().find({ where, select });
  }

  public getAll(select?: (keyof TEntity)[]): Promise<TEntity[]> {
    return this.getRepo()
      .createQueryBuilder()
      .select(select as string[])
      .getMany();
  }

  public getAllByProgramPk(programPk: string): Promise<TEntity[]> {
    return (this.getRepo() as Repository<any>).find({ where: { programPk } });
  }

  public addOrUpdateEntity(entity: TEntity) {
    return this.addOrUpdateEntities(entity);
  }

  public addOrUpdateEntities(...entities: TEntity[]) {
    return this.getRepo().save(entities);
  }

  public async addOrUpdateFromSolanaEntity(
    entity: ProgramAccount<TSolanaEntity>,
    ...additionalArgs: any[]
  ) {
    return this.addOrUpdateFromSolanaEntities([entity], ...additionalArgs);
  }

  public async getCount(where?: FindOptionsWhere<TEntity>) {
    return this.getRepo().count({ where });
  }

  public async getDistinctCount(distinctKey: keyof TEntity): Promise<number> {
    const { count } = await this.getRepo()
      .createQueryBuilder()
      .select(`COUNT(DISTINCT("${distinctKey as string}"))`, 'count')
      .getRawOne();
    return count;
  }

  public async addOrUpdateFromSolanaEntities(
    entities: ProgramAccount<TSolanaEntity>[],
    ...additionalArgs: any[]
  ) {
    const repo = this.getRepo();
    const dbEntities = await Promise.all(
      entities.map(async (x) => this.mapSolanaEntityToDb(x, ...additionalArgs)),
    );

    return repo.save(dbEntities);
  }

  public getAllBy(key: keyof TEntity, keys: string[]) {
    return this.getRepo().find({
      where: {
        [key]: In(keys),
      } as any,
    });
  }

  public async getByBatch(key: keyof TEntity, keys: readonly string[]) {
    const entities = await this.getAllBy(key, keys as string[]);
    return this._mapResultToIds(key, keys as string[], entities);
  }

  private _mapResultToIds(
    key: keyof TEntity,
    keys: string[],
    entities: TEntity[],
  ) {
    return keys.map(
      (x) => entities.filter((entity) => entity[key] === x) || null,
    );
  }

  public async upsertFromSolanaEntities(
    entities: ProgramAccount<TSolanaEntity>[],
    conflictPaths: (keyof TEntity)[],
    ...additionalArgs: any[]
  ) {
    const repo = this.getRepo();
    const dbEntities = await Promise.all(
      entities.map(async (x) => this.mapSolanaEntityToDb(x, ...additionalArgs)),
    );

    const chunkedEntities = chunkArray(dbEntities, 500);
    const results = await Promise.all(
      chunkedEntities.map((x) =>
        repo.upsert(x, {
          conflictPaths: conflictPaths as string[],
          skipUpdateIfNoValuesChanged: true,
        }),
      ),
    );

    return results.flatMap((x) => x);
  }

  protected abstract getRepo(): Repository<TEntity>;

  protected abstract mapSolanaEntityToDb(
    solanaEntity: ProgramAccount<TSolanaEntity>,
    ...args: any[]
  ): Promise<TEntity> | TEntity;
}

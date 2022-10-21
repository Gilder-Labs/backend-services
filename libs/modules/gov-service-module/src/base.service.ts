import {
  FindOptionsSelect,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { BaseGovEntity } from '@gilder/gov-db-entities';
import { ProgramAccount } from '@solana/spl-governance';

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

  public getAll(select?: FindOptionsSelect<TEntity>): Promise<TEntity[]> {
    return this.getRepo().find({ select });
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

  public async addOrUpdateFromSolanaEntities(
    entities: ProgramAccount<TSolanaEntity>[],
    ...additionalArgs: any[]
  ) {
    const repo = this.getRepo();
    const dbEntities = await Promise.all(
      entities.map(async (x) => this.mapSolanaEntityToDb(x, ...additionalArgs)),
    );

    return repo.save(dbEntities, { chunk: 1000 });
  }

  protected abstract getRepo(): Repository<TEntity>;

  protected abstract mapSolanaEntityToDb(
    solanaEntity: ProgramAccount<TSolanaEntity>,
    ...args: any[]
  ): Promise<TEntity> | TEntity;
}

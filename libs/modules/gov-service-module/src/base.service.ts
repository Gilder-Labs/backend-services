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
  abstract get conflictPaths(): (keyof TEntity)[];

  getBy(
    where: FindOptionsWhere<TEntity>,
    select?: FindOptionsSelect<TEntity>,
  ): Promise<TEntity | null> {
    return this.getRepo().findOne({ where, select });
  }

  filterBy(
    where: FindOptionsWhere<TEntity>,
    select?: FindOptionsSelect<TEntity>,
  ): Promise<TEntity[]> {
    return this.getRepo().find({ where, select });
  }

  getAll(select?: FindOptionsSelect<TEntity>): Promise<TEntity[]> {
    return this.getRepo().find({ select });
  }

  getAllByProgramPk(programPk: string): Promise<TEntity[]> {
    return (this.getRepo() as Repository<any>).find({ where: { programPk } });
  }

  addOrUpdateEntity(entity: TEntity) {
    return this.addOrUpdateEntities(entity);
  }

  addOrUpdateEntities(...entities: TEntity[]) {
    return this.getRepo().save(entities);
  }

  async addOrUpdateFromSolanaEntity(entity: ProgramAccount<TSolanaEntity>) {
    return this.addOrUpdateFromSolanaEntities(entity);
  }

  async addOrUpdateFromSolanaEntities(
    ...entities: ProgramAccount<TSolanaEntity>[]
  ) {
    const repo = this.getRepo();
    const dbEntities = await Promise.all(
      entities.map(async (x) => this.mapSolanaEntityToDb(x)),
    );

    return repo.save(dbEntities);
  }

  abstract getRepo(): Repository<TEntity>;

  abstract mapSolanaEntityToDb(
    solanaEntity: ProgramAccount<TSolanaEntity>,
  ): Promise<TEntity> | TEntity;
}

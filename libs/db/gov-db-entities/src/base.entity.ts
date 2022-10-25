import { Column } from 'typeorm';

export abstract class BaseGovEntity {
  @Column('text')
  programPk: string;
}

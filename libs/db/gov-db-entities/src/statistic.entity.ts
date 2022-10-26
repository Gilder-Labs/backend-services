import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CalculatedStatistic {
  @PrimaryGeneratedColumn('uuid')
  statisticId: string;

  @Column('int')
  numberRealms: number;

  @Column('int')
  numberProposals: number;

  @Column('int')
  numberVotes: number;

  @Column('int')
  numberGovernances: number;

  @Column('int')
  numTokenOwners: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Metric {
  @PrimaryGeneratedColumn('uuid')
  metricId: string;

  @Column('int')
  totalRealms: number;

  @Column('int')
  totalProposals: number;

  @Column('int')
  totalVotes: number;

  @Column('int')
  totalGovernances: number;

  @Column('int')
  totalUniqueTokenOwners: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}

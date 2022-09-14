import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Proposal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  realmPubkey!: string;

  @Column('text')
  name!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  descriptionLink!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  label!: string;

  @Column()
  draftAt!: number;
}

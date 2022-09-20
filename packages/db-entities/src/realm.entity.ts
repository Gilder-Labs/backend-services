import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique('constraint_name', ['pubkey'])
export class Realm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  pubkey!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  owner!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  name!: string;
}

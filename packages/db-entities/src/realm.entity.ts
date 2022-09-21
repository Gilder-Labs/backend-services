import {
  Entity,
  Column,
  Unique,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique('constraint_name', ['pubkey'])
export class Realm {
  @PrimaryColumn('text')
  pubkey!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  governance!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  name!: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at!: Date;
}

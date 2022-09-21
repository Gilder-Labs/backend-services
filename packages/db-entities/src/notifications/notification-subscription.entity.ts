import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { NotificationType } from '@gilder/types';

@Entity()
export class NotificationSubscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  mobileToken!: string;

  @Column('text')
  type!: NotificationType;

  @Column('text')
  realmPubKey!: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

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

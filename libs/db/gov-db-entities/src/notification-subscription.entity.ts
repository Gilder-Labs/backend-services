import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type {
  NotificationType,
  NotificationSubscription as INotificationSubscription,
} from '@gilder/types';

@Entity()
@Unique('notification-subscription-constraint', [
  'mobileToken',
  'type',
  'realmPk',
])
export class NotificationSubscription implements INotificationSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  mobileToken: string;

  @Column('text')
  type: NotificationType;

  @Column('text')
  realmPk: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
} from 'typeorm';
import type {
  NotificationType,
  NotificationSubscription as INotificationSubscription,
} from '@gilder/types';

@Entity()
@Unique('constraint_name', ['mobileToken', 'type', 'realmPk'])
export class NotificationSubscription
  extends BaseEntity
  implements INotificationSubscription
{
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
}

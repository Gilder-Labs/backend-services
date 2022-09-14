import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NotificationSubscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  mobileToken!: string;

  @Column('text')
  deviceType!: string;

  @Column('text')
  type!: string;

  @Column('text')
  realm!: string;

  @Column({
    default: true,
  })
  isActive!: boolean;
}

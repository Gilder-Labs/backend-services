import { Field, ObjectType } from '@nestjs/graphql';
import type { NotificationSubscription as INotificationSubscription } from '@gilder/types';

@ObjectType()
export class NotificationSubscription
  implements Omit<INotificationSubscription, 'type'>
{
  @Field()
  id: string;

  @Field()
  mobileToken: string;

  @Field()
  type: string;

  @Field()
  realmPk: string;

  @Field()
  isActive: boolean;
}

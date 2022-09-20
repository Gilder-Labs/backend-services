import { NotificationSubscription, Realm } from '@gilder/db-entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotifyData } from './types';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationSubscription)
    private notificationSubscriptionsRepository: Repository<NotificationSubscription>,
    @InjectRepository(Realm) private realmsRepository: Repository<Realm>,
  ) {}

  getAll(): Promise<NotificationSubscription[]> {
    return this.notificationSubscriptionsRepository.find();
  }

  getOneById(id: string): Promise<NotificationSubscription> {
    return this.notificationSubscriptionsRepository.findOneByOrFail({ id });
  }

  subscribe(body: NotifyData): Promise<NotificationSubscription> {
    const newSubscription = this.notificationSubscriptionsRepository.create({
      type: body.type,
      realmPubKey: body.realm,
      isActive: true,
      mobileToken: body.mobileToken,
    });

    return this.notificationSubscriptionsRepository.save(newSubscription);
  }

  getDeviceSubscriptions(
    body: NotifyData,
  ): Promise<NotificationSubscription[]> {
    return this.notificationSubscriptionsRepository.find({
      select: ['type', 'realmPubKey'],
      where: { mobileToken: body.mobileToken },
    });
  }
}

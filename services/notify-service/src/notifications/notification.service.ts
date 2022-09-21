import { NotificationSubscription, Realm } from '@gilder/db-entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MONITOR_SERVICE } from './constants';
import { NotifyData } from './types';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(MONITOR_SERVICE) private client: ClientProxy,
    @InjectRepository(NotificationSubscription)
    private notificationSubscriptionsRepository: Repository<NotificationSubscription>,
  ) {}

  getAll(): Promise<NotificationSubscription[]> {
    return this.notificationSubscriptionsRepository.find();
  }

  getOneById(id: string): Promise<NotificationSubscription> {
    return this.notificationSubscriptionsRepository.findOneByOrFail({ id });
  }

  async subscribe(body: NotifyData): Promise<NotificationSubscription> {
    const newSubscription = this.notificationSubscriptionsRepository.create({
      type: body.type,
      realmPubKey: body.realm,
      isActive: true,
      mobileToken: body.mobileToken,
    });

    try {
      const result = await this.notificationSubscriptionsRepository.save(
        newSubscription,
      );

      this.client.emit('new_notification_subscription', result);

      return result;
    } catch (e) {
      this.logger.error(`Something went wrong. Error: ${e}`);
    }
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
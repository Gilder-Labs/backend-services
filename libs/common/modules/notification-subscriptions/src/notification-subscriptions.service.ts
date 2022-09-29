import { NotificationSubscription } from '@gilder/db-entities';
import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MONITOR_SERVICE } from './constants';
import { NotifyData } from './types';

@Injectable()
export class NotificationSubscriptionsService {
  private readonly logger = new Logger(NotificationSubscriptionsService.name);

  constructor(
    @Optional() @Inject(MONITOR_SERVICE) private client: ClientProxy,
    @InjectRepository(NotificationSubscription)
    private notificationSubscriptionsRepository: Repository<NotificationSubscription>,
  ) {}

  getAll(): Promise<NotificationSubscription[]> {
    return this.notificationSubscriptionsRepository.find();
  }

  getByMobileToken(mobileToken: string): Promise<NotificationSubscription[]> {
    return this.notificationSubscriptionsRepository.find({
      where: {
        mobileToken,
      },
    });
  }

  getOneById(id: string): Promise<NotificationSubscription> {
    return this.notificationSubscriptionsRepository.findOneByOrFail({ id });
  }

  async subscribe(body: NotifyData): Promise<NotificationSubscription | null> {
    const newSubscription = this.notificationSubscriptionsRepository.create({
      type: body.type,
      realmPk: body.realmPk,
      isActive: true,
      mobileToken: body.mobileToken,
    });

    try {
      const result = await this.notificationSubscriptionsRepository.save(
        newSubscription,
      );

      this.client?.emit('new_notification_subscription', result);

      return result;
    } catch (e) {
      this.logger.error(`Something went wrong. Error: ${e}`);
    }

    return null;
  }

  getDeviceSubscriptions(
    body: NotifyData,
  ): Promise<NotificationSubscription[]> {
    return this.notificationSubscriptionsRepository.find({
      select: ['type', 'realmPk'],
      where: { mobileToken: body.mobileToken },
    });
  }
}

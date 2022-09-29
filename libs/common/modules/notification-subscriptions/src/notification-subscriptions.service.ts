import { NotificationSubscription } from '@gilder/db-entities';
import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
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
    try {
      const newSubscription =
        await this.notificationSubscriptionsRepository.upsert(
          {
            type: body.type,
            realmPk: body.realmPk,
            isActive: true,
            mobileToken: body.mobileToken,
          },
          {
            conflictPaths: ['realmPk', 'mobileToken'],
            skipUpdateIfNoValuesChanged: true,
          },
        );
      const subscription =
        await this.notificationSubscriptionsRepository.findOne({
          where: { id: newSubscription.identifiers[0].id },
        });

      this.client?.emit('new_notification_subscription', subscription);

      return subscription;
    } catch (e) {
      this.logger.error(`Something went wrong. Error: ${e}`);
    }

    return null;
  }

  async unsubscribe(body: NotifyData): Promise<boolean> {
    try {
      await this.notificationSubscriptionsRepository.update(
        {
          mobileToken: body.mobileToken,
          realmPk: body.realmPk,
          type: body.type,
        },
        { isActive: false },
      );

      return true;
    } catch (e) {
      this.logger.error(`Something went wrong. Error: ${e}`);
    }

    return false;
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

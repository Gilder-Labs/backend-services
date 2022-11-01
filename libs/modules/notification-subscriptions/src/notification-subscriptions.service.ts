import { NotificationSubscription } from '@gilder/gov-db-entities';
import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotifyData } from './types';

@Injectable()
export class NotificationSubscriptionsService {
  private readonly logger = new Logger(NotificationSubscriptionsService.name);

  constructor(
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
            conflictPaths: ['type', 'mobileToken', 'realmPk'],
            skipUpdateIfNoValuesChanged: true,
          },
        );

      if (!newSubscription.identifiers[0]) {
        this.logger.log(
          `No subscription needed to be updated for ${JSON.stringify(body)}`,
        );
      }

      const subscription =
        await this.notificationSubscriptionsRepository.findOne({
          where: {
            mobileToken: body.mobileToken,
            type: body.type,
            realmPk: body.realmPk,
          },
        });

      return subscription;
    } catch (e) {
      this.logger.error(
        `Unable to create/update subscription for ${JSON.stringify(
          body,
          undefined,
          4,
        )}\nError: ${e}}`,
      );
      throw e;
    }
  }

  async unsubscribe(body: NotifyData): Promise<boolean> {
    await this.notificationSubscriptionsRepository.update(
      {
        mobileToken: body.mobileToken,
        realmPk: body.realmPk,
        type: body.type,
      },
      { isActive: false },
    );

    return true;
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

import { NotificationSubscription } from '@gilder/db-entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { NotificationType } from '@gilderlabs/types';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type {
  ExpoNotification,
  NotifyProposalData,
  ProcessNewProposalData,
} from '@gilder/internal-types';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(NotificationSubscription)
    private readonly subscriptionRepo: Repository<NotificationSubscription>,
  ) {}

  public getNotifySubscriptions(type: NotificationType, realmPk: string) {
    return this.subscriptionRepo.find({
      where: { type: type, realmPk: realmPk },
    });
  }

  public async notifyNewProposals({
    realmPk,
    proposalPk,
    proposalName,
    realmName,
  }: ProcessNewProposalData) {
    const subs = await this.getNotifySubscriptions('newProposals', realmPk);
    const expoNotifications = subs.map<ExpoNotification<NotifyProposalData>>(
      (x) => ({
        to: x.mobileToken,
        title: `New proposal on ${realmName}`,
        sound: 'default',
        body: proposalName,
        data: {
          proposalId: proposalPk,
          realmId: realmPk,
        },
      }),
    );

    await this.pushExpoNotifications(expoNotifications);
  }

  public async pushExpoNotifications(
    notifications: ExpoNotification[],
  ): Promise<void> {
    await Promise.all(
      notifications.map(async (notification: ExpoNotification) => {
        try {
          await firstValueFrom(
            this.httpService.post(
              'https://api.expo.dev/v2/push/send',
              notification,
            ),
          );
        } catch (e) {
          this.logger.error(`Something went wrong. Error: ${e}`);
        }
      }),
    );
  }
}

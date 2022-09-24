import { NotificationSubscription, Realm } from '@gilder/db-entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramAccount, Proposal } from '@solana/spl-governance';
import { Repository } from 'typeorm';
import type {
  ExpoNotification,
  NotificationType,
  NotifyProposalData,
} from '@gilder/types';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotifyService {
  private readonly logger = new Logger(NotifyService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(NotificationSubscription)
    private readonly subscriptionRepo: Repository<NotificationSubscription>,
  ) {}

  public getNotifySubscriptions(type: NotificationType, realm: Realm) {
    return this.subscriptionRepo.find({
      where: { type: type, realmPk: realm.realmPk },
    });
  }

  public async notifyNewProposals(
    realm: Realm,
    proposal: ProgramAccount<Proposal>,
  ) {
    const subs = await this.getNotifySubscriptions('newProposals', realm);
    const expoNotifications = subs.map<ExpoNotification<NotifyProposalData>>(
      (x) => ({
        to: x.mobileToken,
        title: `New proposal on ${realm.name}`,
        sound: 'default',
        body: proposal.account.name,
        data: {
          proposalId: proposal.pubkey.toBase58(),
          realmId: realm.realmPk,
        },
      }),
    );

    await this.pushExpoNotifications(expoNotifications);
  }

  public async pushExpoNotifications(
    notifications: ExpoNotification[],
  ): Promise<void> {
    notifications.forEach(async (notification: ExpoNotification) => {
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
    });
  }
}

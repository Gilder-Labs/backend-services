import { NEW_NOTIFICATION_SUBSCRIPTION } from '@gilder/constants';
import { NotificationSubscription } from '@gilder/db-entities';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ProposalListenerService } from './proposal.listener';

@Controller()
export class ProposalController {
  constructor(
    private readonly proposalListenerService: ProposalListenerService,
  ) {}

  @EventPattern(NEW_NOTIFICATION_SUBSCRIPTION)
  public async handleNewNotificationSubscription(
    data: NotificationSubscription,
  ) {
    await this.proposalListenerService.tryAddNewRealmListener(data);
  }
}

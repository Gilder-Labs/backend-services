import { NEW_NOTIFICATION_SUBSCRIPTION } from '@gilder/constants';
import { NotificationSubscription } from '@gilder/db-entities';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ProposalsMonitorService } from './proposals.monitor';

@Controller()
export class ProposalController {
  constructor(
    private readonly proposalMonitorService: ProposalsMonitorService,
  ) {}

  @EventPattern(NEW_NOTIFICATION_SUBSCRIPTION)
  public async handleNewNotificationSubscription(
    data: NotificationSubscription,
  ) {
    await this.proposalMonitorService.tryAddNewRealmListener(data);
  }
}

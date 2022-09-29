import { NotificationSubscription } from '@gilder/db-entities';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ProposalsMonitorService } from './proposals.monitor';

@Controller({})
export class ProposalController {
  constructor(
    private readonly proposalMonitorService: ProposalsMonitorService,
  ) {}

  @EventPattern('new_notification_subscription')
  public async handleNewNotificationSubscription(
    data: NotificationSubscription,
  ) {
    await this.proposalMonitorService.tryAddNewRealmListener(data);
  }
}

import { NotificationSubscription } from '@gilder/db-entities';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ProposalsMonitorService } from './proposals.monitor';

@Controller({})
export class ProposalController {
  private readonly logger = new Logger(ProposalController.name);

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

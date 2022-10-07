import { NOTIFICATION_QUEUE } from '@gilder/constants';
import { ProcessNewProposalData, NotificationTypes } from '@gilder/types';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NotificationsService } from './notifications.service';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationService: NotificationsService) {}

  @Process(NotificationTypes.NEW_PROPOSALS)
  async processProposalNotification(job: Job<ProcessNewProposalData>) {
    this.logger.log(
      `Processing '${NotificationTypes.NEW_PROPOSALS}' message in queue...`,
    );
    await this.notificationService.notifyNewProposals(job.data);
  }
}

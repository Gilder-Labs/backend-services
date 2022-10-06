import { NOTIFICATION_QUEUE, PROPOSAL_NOTIFICATION } from '@gilder/constants';
import { NewProposalData } from '@gilder/types';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NotificationsService } from './notifications.service';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationService: NotificationsService) {}

  @Process(PROPOSAL_NOTIFICATION)
  async processProposalNotification(job: Job<NewProposalData>) {
    this.logger.log("Processing 'New Proposal' message in queue...");
    await this.notificationService.notifyNewProposals(job.data);
  }
}

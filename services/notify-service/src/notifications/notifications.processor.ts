import { NOTIFICATION_QUEUE, PROPOSAL_NOTIFICATION } from '@gilder/constants';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor {
  @Process(PROPOSAL_NOTIFICATION)
  async processProposalNotification(job: Job<unknown>) {
    return {};
  }
}

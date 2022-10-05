import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('notification')
export class AudioConsumer {
  @Process()
  async processNotificationMessage(job: Job<unknown>) {
    return {};
  }
}

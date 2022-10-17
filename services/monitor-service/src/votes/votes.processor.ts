import { VOTES_QUEUE } from '@gilder/constants';
import { BulkProcessUpdates, QueueProcessTypes } from '@gilder/internal-types';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor(VOTES_QUEUE)
export class VotesProcessor {
  private readonly logger = new Logger(VotesProcessor.name);

  constructor() {}

  @Process(QueueProcessTypes.UPDATE_PROCESS)
  async processProposalVotes(job: Job<BulkProcessUpdates<any>>) {}
}

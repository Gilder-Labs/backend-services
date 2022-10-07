import { TREASURIES_QUEUE } from '@gilder/constants';
import { BulkProcessRealmProposals, QueueProcessTypes } from '@gilder/types';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor(TREASURIES_QUEUE)
export class TreasuriesProcessor {
  private readonly logger = new Logger(TreasuriesProcessor.name);

  constructor() {}

  @Process(QueueProcessTypes.UPDATE_PROCESS)
  async processRealmTokenOwners(job: Job<BulkProcessRealmProposals>) {}
}

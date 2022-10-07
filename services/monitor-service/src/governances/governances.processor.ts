import { GOVERNANCE_QUEUE } from '@gilder/constants';
import {
  BulkProcessUpdates,
  ProcessRealmData,
  QueueProcessTypes,
} from '@gilder/types';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor(GOVERNANCE_QUEUE)
export class GovernanceProcessor {
  private readonly logger = new Logger(GovernanceProcessor.name);

  constructor() {}

  @Process(QueueProcessTypes.UPDATE_PROCESS)
  async processRealmGovernances(
    job: Job<BulkProcessUpdates<ProcessRealmData>>,
  ) {}
}

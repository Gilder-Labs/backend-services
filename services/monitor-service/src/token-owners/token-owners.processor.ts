import { PROPOSAL_QUEUE, TOKEN_OWNER_QUEUE } from '@gilder/constants';
import { ProposalRPCService, ProposalsService } from '@gilder/proposals-module';
import { BulkProcessRealmProposals, QueueProcessTypes } from '@gilder/types';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor(TOKEN_OWNER_QUEUE)
export class TokenOwnersProcessor {
  private readonly logger = new Logger(TokenOwnersProcessor.name);

  constructor() {}

  @Process(QueueProcessTypes.UPDATE_PROCESS)
  async processRealmTokenOwners(job: Job<BulkProcessRealmProposals>) {}
}

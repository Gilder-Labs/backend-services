import { PROPOSAL_QUEUE } from '@gilder/constants';
import { ProposalRPCService, ProposalsService } from '@gilder/proposals-module';
import { BulkProcessRealmProposals, QueueProcessTypes } from '@gilder/types';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor(PROPOSAL_QUEUE)
export class ProposalProcessor {
  private readonly logger = new Logger(ProposalProcessor.name);

  constructor(
    private readonly proposalRpcService: ProposalRPCService,
    private readonly proposalService: ProposalsService,
  ) {}

  @Process(QueueProcessTypes.UPDATE_PROCESS)
  async processRealmProposals(job: Job<BulkProcessRealmProposals>) {
    const { realms } = job.data;
    this.logger.log(`Updating proposals...`);

    await Promise.all(
      realms.map(async ({ realmPk, programPk }) => {
        const proposals =
          await this.proposalRpcService.getProposalsFromSolanaByRealm({
            realmPk,
            programPk,
          });

        await this.proposalService.addOrUpdateProposals(
          { realmPk, programPk },
          proposals,
        );
      }),
    );
  }
}

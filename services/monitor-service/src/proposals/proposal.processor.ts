import { PROPOSAL_QUEUE } from '@gilder/constants';
import { ProposalRPCService, ProposalsService } from '@gilder/proposals-module';
import {
  BulkProcessUpdates,
  ProcessRealmData,
  QueueProcessTypes,
} from '@gilder/types';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor(PROPOSAL_QUEUE)
export class ProposalProcessor {
  constructor(
    private readonly proposalRpcService: ProposalRPCService,
    private readonly proposalService: ProposalsService,
  ) {}

  @Process(QueueProcessTypes.UPDATE_PROCESS)
  async processRealmProposals(job: Job<BulkProcessUpdates<ProcessRealmData>>) {
    const { entities } = job.data;
    await Promise.all(
      entities.map(async ({ realmPk, programPk }) => {
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

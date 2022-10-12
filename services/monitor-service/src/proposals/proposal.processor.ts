import { PROPOSAL_QUEUE } from '@gilder/constants';
import { ProposalRPCService, ProposalsService } from '@gilder/proposals-module';
import { RpcManagerService } from '@gilder/rpc-manager-module';
import {
  BulkProcessUpdates,
  ProcessRealmData,
  QueueProcessTypes,
} from '@gilder/types';
import { Processor, Process } from '@nestjs/bull';
import { Connection, PublicKey } from '@solana/web3.js';
import { Job } from 'bull';
import { PROPOSAL_CONNECTION } from 'src/utils/constants';

@Processor(PROPOSAL_QUEUE)
export class ProposalProcessor {
  private readonly connection: Connection;

  constructor(
    private readonly proposalRpcService: ProposalRPCService,
    private readonly proposalService: ProposalsService,
    rpcManager: RpcManagerService,
  ) {
    this.connection = rpcManager.getConnection(PROPOSAL_CONNECTION);
  }

  @Process(QueueProcessTypes.UPDATE_PROCESS)
  async processRealmProposals(job: Job<BulkProcessUpdates<ProcessRealmData>>) {
    const { entities } = job.data;
    await Promise.all(
      entities.map(async ({ realmPk, programPk }) => {
        const realm = {
          realmPk,
          programPk,
        };
        const proposals =
          await this.proposalRpcService.getProposalsFromSolanaByRealm(
            realm,
            this.connection,
          );

        await this.proposalService.addOrUpdateProposals(
          realm,
          proposals,
          this.connection,
        );
      }),
    );
  }
}

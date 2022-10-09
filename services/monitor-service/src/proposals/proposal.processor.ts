import { PROPOSAL_QUEUE } from '@gilder/constants';
import { ProposalRPCService, ProposalsService } from '@gilder/proposals-module';
import { RpcManagerService } from '@gilder/rpc-manager-module';
import {
  BulkProcessUpdates,
  ProcessRealmData,
  QueueProcessTypes,
} from '@gilder/types';
import { Processor, Process } from '@nestjs/bull';
import { PublicKey } from '@solana/web3.js';
import { Job } from 'bull';

@Processor(PROPOSAL_QUEUE)
export class ProposalProcessor {
  constructor(
    private readonly proposalRpcService: ProposalRPCService,
    private readonly proposalService: ProposalsService,
    private readonly rpcManager: RpcManagerService,
  ) {}

  @Process(QueueProcessTypes.UPDATE_PROCESS)
  async processRealmProposals(job: Job<BulkProcessUpdates<ProcessRealmData>>) {
    const { entities } = job.data;
    await Promise.all(
      entities.map(async ({ realmPk, programPk }) => {
        const realm = {
          realmPk: new PublicKey(realmPk),
          programPk: new PublicKey(programPk),
        };
        const proposals =
          await this.proposalRpcService.getProposalsFromSolanaByRealm(
            realm,
            this.rpcManager.connection,
          );

        await this.proposalService.addOrUpdateProposals(realm, proposals);
      }),
    );
  }
}

import { GovernancesService } from '@gilder/governances-module';
import { ProposalsService } from '@gilder/proposals-module';
import { RealmsRestService, RealmsService } from '@gilder/realms-module';
import { RpcManagerService } from '@gilder/rpc-manager-module';
import { tryGetProposalData, tryGetRealmData } from '@gilder/utilities';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ProposalState } from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { DEFAULT_CONNECTION, WS_CONNECTION } from 'src/utils/constants';

@Injectable()
export class GovernanceProgramsMonitorService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(GovernanceProgramsMonitorService.name);

  private subscriptionIds: number[] = [];
  private readonly wsConnection: Connection;
  private readonly connection: Connection;

  constructor(
    private readonly governanceService: GovernancesService,
    private readonly proposalsService: ProposalsService,
    private readonly realmsService: RealmsService,
    private readonly realmsRestService: RealmsRestService,
    rpcManager: RpcManagerService,
  ) {
    this.wsConnection = rpcManager.getConnection(WS_CONNECTION);
    this.connection = rpcManager.getConnection(DEFAULT_CONNECTION);
  }

  private addGovernanceProgramSubscriber(programPk: PublicKey) {
    this.logger.log(`Listening for changes on program: ${programPk}`);
    return this.wsConnection.onProgramAccountChange(
      programPk,
      async (keyedAccountInfo) => {
        try {
          const { accountId, accountInfo } = keyedAccountInfo;

          const [realm] = await Promise.all([
            // tryGetProposalData(accountId, accountInfo),
            tryGetRealmData(accountId, accountInfo),
          ]);

          // if (proposal) {
          //   const governance = await this.governanceService.getGovernanceByPk(
          //     proposal.account.governance.toBase58(),
          //   );

          //   if (governance) {
          //     this.logger.log(
          //       `Adding/Updating Proposal: ${JSON.stringify(proposal)}`,
          //     );
          //     await this.proposalsService.addOrUpdateProposals(
          //       {
          //         realmPk: governance.realmPk,
          //         programPk: programPk.toBase58(),
          //       },
          //       [proposal],
          //       this.connection,
          //     );
          //   }
          // }

          if (realm) {
            this.logger.log(`Adding/Updating Realm: ${JSON.stringify(realm)}`);
            await this.realmsService.addOrUpdateRealms([realm]);
          }
        } catch (e) {
          this.logger.error(`Something went wrong. Error: ${e}`);
        }
      },
      'confirmed',
    );
  }

  async onModuleInit() {
    const governanceProgramPks =
      await this.realmsRestService.getSplGovernancePrograms();
    for (const programPk of governanceProgramPks) {
      const subId = this.addGovernanceProgramSubscriber(programPk);
      this.subscriptionIds.push(subId);
    }
  }

  async onModuleDestroy() {
    for (const subId of this.subscriptionIds) {
      await this.wsConnection.removeProgramAccountChangeListener(subId);
    }
  }
}

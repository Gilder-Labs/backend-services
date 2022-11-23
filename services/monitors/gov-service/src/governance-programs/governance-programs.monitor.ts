import {
  GovernancesService,
  ProposalsService,
  ProposalTransactionsService,
  RealmsRestService,
  RealmsService,
  SignatoryRecordsService,
  TokenOwnersService,
  VoteRecordsService,
} from '@gilder/gov-service-module';
import { RpcManagerService } from '@gilder/connection-manager-module';
import { AccountType, getAccountType, parseAccount } from '@gilder/utilities';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ProgramAccount, getGovernance } from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { DEFAULT_CONNECTION, WS_CONNECTION } from '../utils/constants';

@Injectable()
export class GovernanceProgramsMonitorService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(GovernanceProgramsMonitorService.name);

  private subscriptionIds: number[] = [];
  private readonly wsConnection: Connection;
  private readonly connection: Connection;

  @Inject(GovernancesService)
  private readonly governanceService: GovernancesService;

  @Inject(ProposalsService)
  private readonly proposalsService: ProposalsService;

  @Inject(RealmsService)
  private readonly realmsService: RealmsService;

  @Inject(RealmsRestService)
  private readonly realmsRestService: RealmsRestService;

  @Inject(TokenOwnersService)
  private readonly tokenOwnersService: TokenOwnersService;

  @Inject(ProposalTransactionsService)
  private readonly proposalTransactionService: ProposalTransactionsService;

  @Inject(VoteRecordsService)
  private readonly voteRecordsService: VoteRecordsService;

  @Inject(SignatoryRecordsService)
  private readonly signatoryRecordsService: SignatoryRecordsService;

  constructor(rpcManager: RpcManagerService) {
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
          const parsedData = parseAccount(accountId.toBase58(), {
            ...accountInfo,
            data: accountInfo.data,
            owner: accountInfo.owner.toBase58(),
          });

          if (!parsedData) {
            return;
          }

          const accountType = getAccountType(parsedData?.type);
          if (!accountType) {
            return;
          }

          await this.processData(accountType, parsedData.account);
        } catch (e) {
          this.logger.error(`Something went wrong. Error: ${e}`);
        }
      },
      'confirmed',
    );
  }

  private async processData(type: AccountType, account: ProgramAccount<any>) {
    this.logger.log(`Adding/Updating entity type: ${type}`);

    switch (type) {
      case 'realm':
        await this.realmsService.addOrUpdateFromSolanaEntity(account);
        return;
      case 'proposal':
        const governance = await getGovernance(
          this.connection,
          account.account.governance,
        );
        await this.proposalsService.addOrUpdateFromSolanaEntity(
          account,
          governance,
        );
        return;
      case 'governance':
        await this.governanceService.addOrUpdateFromSolanaEntity(account);
        return;
      case 'token-owner':
        await this.tokenOwnersService.addOrUpdateFromSolanaEntity(account);
        return;
      case 'proposal-transaction':
        await this.proposalTransactionService.addOrUpdateFromSolanaEntity(
          account,
        );
        return;
      case 'signatory-record':
        await this.signatoryRecordsService.addOrUpdateFromSolanaEntity(account);
        return;
      case 'vote-record':
        await this.voteRecordsService.addOrUpdateFromSolanaEntity(account);
        return;
    }
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

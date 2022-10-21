import {
  GovernancesService,
  ProgramMetadataService,
  ProposalsService,
  ProposalTransactionsService,
  RealmsRestService,
  RealmsService,
  SignatoryRecordsService,
  TokenOwnersService,
  VoteRecordsService,
} from '@gilder/gov-service-module';
import { RpcManagerService } from '@gilder/rpc-manager-module';
import {
  AccountType,
  getAccountType,
  getAllProgramAccounts,
  parseAccount,
} from '@gilder/utilities';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  Proposal,
  Governance,
  ProgramAccount,
  TokenOwnerRecord,
  getGovernance,
} from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { groupBy } from 'lodash';
import { DEFAULT_CONNECTION, WS_CONNECTION } from 'src/utils/constants';

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

  @Inject(ProgramMetadataService)
  private readonly programMetadataService: ProgramMetadataService;

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
      case 'program-metadata':
        await this.programMetadataService.addOrUpdateFromSolanaEntity(account);
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

    this.seedDatabase(governanceProgramPks.map((x) => x.toBase58()));
  }

  async seedDatabase(programPks: string[]) {
    this.logger.log('Starting seeding process...');

    this.logger.log('Querying all program account data...');
    const allData = await getAllProgramAccounts(programPks, this.connection);
    this.logger.log('Finished querying!');

    this.logger.log(
      `
Discovered...
${allData.realm.length} Realms
${allData['token-owner'].length} Token Owners
${allData.governance.length} Governances
${allData.proposal.length} Proposals
${allData['program-metadata'].length} Program Metadata
${allData['proposal-transaction'].length} Proposal Transactions
${allData['signatory-record'].length} Signatory Records
${allData['vote-record'].length} Vote Records`,
    );

    for (const [key, entities] of Object.entries(allData)) {
      const type = key as AccountType;
      switch (type) {
        case 'proposal':
          const groupedProposalsByGovernances = groupBy(
            entities as ProgramAccount<Proposal>[],
            (x) => x.account.governance.toBase58(),
          );
          const governances = allData['governance'];
          for (const [key, proposals] of Object.entries(
            groupedProposalsByGovernances,
          )) {
            const gov = governances.find(
              (x) => x.pubkey.toBase58() === key,
            ) as ProgramAccount<Governance>;
            await this.proposalsService.addOrUpdateFromSolanaEntities(
              proposals,
              gov,
            );
          }
          continue;
        case 'governance':
          await this.governanceService.addOrUpdateFromSolanaEntities(entities);
          continue;
        case 'token-owner':
          await this.tokenOwnersService.addOrUpdateFromSolanaEntities(entities);
          continue;
        case 'realm':
          await this.realmsService.addOrUpdateFromSolanaEntities(entities);
          continue;
        case 'program-metadata':
          await this.programMetadataService.addOrUpdateFromSolanaEntities(
            entities,
          );
          continue;
        case 'proposal-transaction':
          await this.proposalTransactionService.addOrUpdateFromSolanaEntities(
            entities,
          );
          continue;
        case 'signatory-record':
          await this.signatoryRecordsService.addOrUpdateFromSolanaEntities(
            entities,
          );
          continue;
        case 'vote-record':
          await this.voteRecordsService.addOrUpdateFromSolanaEntities(entities);
          continue;
      }
    }

    this.logger.log('Finished seeding the database!');
  }

  async onModuleDestroy() {
    for (const subId of this.subscriptionIds) {
      await this.wsConnection.removeProgramAccountChangeListener(subId);
    }
  }
}

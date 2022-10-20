import { GovernancesService } from '@gilder/governances-module';
import { ProposalsService } from '@gilder/proposals-module';
import { RealmsRestService, RealmsService } from '@gilder/realms-module';
import { RpcManagerService } from '@gilder/rpc-manager-module';
import { TokenOwnersService } from '@gilder/token-owners-module';
import {
  AccountType,
  getAccountType,
  getAllProgramAccounts,
  parseAccount,
  ParsedAccount,
} from '@gilder/utilities';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  getGovernance,
  GovernanceAccountType,
  Proposal,
  Governance,
  ProgramAccount,
  TokenOwnerRecord,
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
        this.logger.log(`Adding/Updating Realm: ${JSON.stringify(account)}`);
        await this.realmsService.addOrUpdateRealms([account]);
        return;
      case 'proposal':
        this.logger.log(`Adding/Updating Proposal: ${JSON.stringify(account)}`);
        const proposal = account.account as Proposal;
        await this.proposalsService.addOrUpdateProposals(
          {
            realmPk: (
              await getGovernance(this.connection, proposal.governance)
            ).account.realm.toBase58(),
            programPk: account.owner.toBase58(),
          },
          [account],
          this.connection,
        );
        return;
      case 'governance':
        this.logger.log(
          `Adding/Updating Governance: ${JSON.stringify(account)}`,
        );
        const governance = account.account as Governance;
        await this.governanceService.addOrUpdateGovernances(
          governance.realm.toBase58(),
          [account],
        );
        return;
      case 'token-owner':
        this.logger.log(
          `Adding/Updating Token Owner: ${JSON.stringify(account)}`,
        );
        const tokenOwner = account.account as TokenOwnerRecord;
        await this.tokenOwnersService.addOrUpdateTokenOwners(
          tokenOwner.realm.toBase58(),
          [account],
        );
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

    const allData = await getAllProgramAccounts(programPks, this.connection);

    this.logger.log(
      `Discovered...\n${allData.realm.length} Realms\n${allData['token-owner'].length} Token Owners\n${allData.governance.length} Governances\n${allData.proposal.length} Proposals`,
    );

    for (const [key, entities] of Object.entries(allData)) {
      const type = key as AccountType;
      switch (type) {
        case 'realm':
          await this.realmsService.addOrUpdateRealms(entities);
          continue;
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
            const realmPk = gov.account.realm.toBase58();
            await this.proposalsService.addOrUpdateProposals(
              { programPk: gov.owner.toBase58(), realmPk },
              proposals,
              this.connection,
            );
          }
          continue;
        case 'governance':
          const groupedGovernancesByRealm = groupBy(
            entities as ProgramAccount<Governance>[],
            (x) => x.account.realm.toBase58(),
          );
          for (const [key, value] of Object.entries(
            groupedGovernancesByRealm,
          )) {
            await this.governanceService.addOrUpdateGovernances(key, value);
          }
          continue;
        case 'token-owner':
          const groupedTokenOwnersByRealm = groupBy(
            entities as ProgramAccount<TokenOwnerRecord>[],
            (x) => x.account.realm.toBase58(),
          );
          for (const [key, value] of Object.entries(
            groupedTokenOwnersByRealm,
          )) {
            await this.tokenOwnersService.addOrUpdateTokenOwners(key, value);
          }
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

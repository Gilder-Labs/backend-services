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
import { RpcManagerService } from '@gilder/rpc-manager-module';
import { AccountType, getAllProgramAccounts } from '@gilder/utilities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Proposal, Governance, ProgramAccount } from '@solana/spl-governance';
import { Connection } from '@solana/web3.js';
import { groupBy } from 'lodash';
import { DEFAULT_CONNECTION } from '../utils/constants';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

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

  public isSeeding = false;

  constructor(rpcManager: RpcManagerService) {
    this.connection = rpcManager.getConnection(DEFAULT_CONNECTION);
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  startSeeding() {
    if (this.isSeeding) {
      this.logger.log('Seeding already in progress... Skipping');
    }

    this.logger.log('Seeding database with latest program data...');
    return this.seedDatabase();
  }

  public async seedDatabase() {
    this.isSeeding = true;

    try {
      const programPks = (
        await this.realmsRestService.getSplGovernancePrograms()
      ).map((x) => x.toBase58());

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

      const keyOrder: Partial<AccountType>[] = [
        'realm',
        'governance',
        'proposal',
        'token-owner',
        'vote-record',
        'proposal-transaction',
        'signatory-record',
      ];

      for (const key of keyOrder) {
        const type = key as AccountType;
        this.logger.log(`Processing ${type}...`);
        const entities = allData[type];

        switch (type) {
          case 'realm':
            await this.realmsService.upsertFromSolanaEntities(entities, [
              'realmPk',
            ]);
            continue;

          case 'governance':
            await this.governanceService.upsertFromSolanaEntities(entities, [
              'governancePk',
            ]);
            continue;

          case 'proposal':
            const groupedProposalsByGovernances = groupBy(
              entities as ProgramAccount<Proposal>[],
              (x) => x.account.governance.toBase58(),
            );
            const governances = allData['governance'];
            await Promise.all(
              Object.entries(groupedProposalsByGovernances).map(
                ([key, proposals]) => {
                  const gov = governances.find(
                    (x) => x.pubkey.toBase58() === key,
                  ) as ProgramAccount<Governance>;
                  return this.proposalsService.upsertFromSolanaEntities(
                    proposals,
                    ['proposalPk'],
                    gov,
                  );
                },
              ),
            );
            continue;

          case 'token-owner':
            await this.tokenOwnersService.upsertFromSolanaEntities(entities, [
              'ownerPk',
            ]);
            continue;

          case 'proposal-transaction':
            await this.proposalTransactionService.upsertFromSolanaEntities(
              entities,
              ['proposalPk', 'instructionIndex'],
            );
            continue;

          case 'signatory-record':
            await this.signatoryRecordsService.upsertFromSolanaEntities(
              entities,
              ['signatoryPk', 'proposalPk'],
            );
            continue;

          case 'vote-record':
            await this.voteRecordsService.upsertFromSolanaEntities(entities, [
              'proposalPk',
              'governingTokenOwnerPk',
            ]);
            continue;
        }
      }

      this.logger.log('Finished seeding the database!');
    } catch (err) {
      this.logger.error(`Unable to seed database... Error: ${err}`);
    } finally {
      this.isSeeding = false;
    }
  }
}

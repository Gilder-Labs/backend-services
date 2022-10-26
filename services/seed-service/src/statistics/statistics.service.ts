import { CalculatedStatistic } from '@gilder/gov-db-entities';
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
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  @InjectRepository(CalculatedStatistic)
  private readonly statisticRepo: Repository<CalculatedStatistic>;

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

  public isCalculating = false;

  @Cron(CronExpression.EVERY_5_MINUTES)
  async calculateStatistics() {
    if (this.isCalculating) {
      this.logger.log('Calculation already in progress... Skipping');
    }

    this.logger.log('Calculating GOV statistics...');
    await this.processCalculation();
  }

  private async processCalculation() {
    const numRealms = await this.realmsService.getCount();
    const numProposals = await this.proposalsService.getCount();
    const numVotes = await this.voteRecordsService.getCount();
    const numGovernances = await this.governanceService.getCount();
    const numTokenOwners = await this.tokenOwnersService.getCount();

    const newEntity = this.statisticRepo.create({
      numberRealms: numRealms,
      numberGovernances: numGovernances,
      numberProposals: numProposals,
      numberVotes: numVotes,
      numTokenOwners: numTokenOwners,
    });

    await this.statisticRepo.save(newEntity);
  }
}

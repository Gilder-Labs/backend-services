import { CalculatedStatistic } from '@gilder/gov-db-entities';
import {
  GovernancesService,
  ProposalsService,
  RealmsService,
  TokenOwnersService,
  VoteRecordsService,
} from '@gilder/gov-service-module';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DEVNET_DB } from '../utils/constants';
import { Repository } from 'typeorm';

@Injectable()
export class DevnetStatisticsService {
  private readonly logger = new Logger(DevnetStatisticsService.name);

  @InjectRepository(CalculatedStatistic, DEVNET_DB)
  private readonly statisticRepo: Repository<CalculatedStatistic>;

  @Inject(GovernancesService)
  private readonly governanceService: GovernancesService;

  @Inject(ProposalsService)
  private readonly proposalsService: ProposalsService;

  @Inject(RealmsService)
  private readonly realmsService: RealmsService;

  @Inject(TokenOwnersService)
  private readonly tokenOwnersService: TokenOwnersService;

  @Inject(VoteRecordsService)
  private readonly voteRecordsService: VoteRecordsService;

  private isCalculating = false;

  @Cron(CronExpression.EVERY_5_MINUTES)
  async calculateStatistics() {
    if (this.isCalculating) {
      this.logger.log('Calculation already in progress... Skipping');
    }

    this.logger.log('Calculating GOV statistics...');
    await this.processCalculation();
    this.logger.log('Finished calculations...');
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

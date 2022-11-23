import { Metric } from '@gilder/gov-db-entities';
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
import { Repository } from 'typeorm';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  @InjectRepository(Metric)
  private readonly metricRepo: Repository<Metric>;

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

  @Cron(CronExpression.EVERY_MINUTE)
  async calculateMetrics() {
    if (this.isCalculating) {
      this.logger.log('Calculation already in progress... Skipping');
    }

    this.logger.log('Calculating GOV statistics...');
    await this.processMetrics();
    this.logger.log('Finished calculations...');
  }

  private async processMetrics() {
    try {
      const numRealms = await this.realmsService.getCount();
      const numProposals = await this.proposalsService.getCount();
      const numVotes = await this.voteRecordsService.getCount();
      const numGovernances = await this.governanceService.getCount();
      const numTokenOwners = await this.tokenOwnersService.getDistinctCount(
        'governingTokenOwnerPk',
      );

      const newEntity = this.metricRepo.create({
        totalRealms: numRealms,
        totalGovernances: numGovernances,
        totalProposals: numProposals,
        totalVotes: numVotes,
        totalUniqueTokenOwners: numTokenOwners,
      });

      await this.metricRepo.save(newEntity);
    } catch (err) {
      this.logger.error(
        `Something went wrong. Error: ${err} Stack: ${err?.stack}`,
      );
    }
  }
}

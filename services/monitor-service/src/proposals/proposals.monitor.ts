import { PROPOSAL_QUEUE } from '@gilder/constants';
import { RealmsService } from '@gilder/realms-module';
import { ProcessRealmData, QueueProcessTypes } from '@gilder/types';
import { chunkArray } from '@gilder/utilities';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';

@Injectable()
export class ProposalsMonitorService {
  private readonly logger = new Logger(ProposalsMonitorService.name);

  constructor(
    @InjectQueue(PROPOSAL_QUEUE)
    private readonly proposalQueue: Queue,
    private readonly realmService: RealmsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async retrieveAllProposals() {
    this.logger.log(
      'Starting a full sweep of all proposals for every realm...',
    );
    const realms = await this.realmService.getAllRealms({
      select: ['realmPk', 'programPk'],
    });
    const processData = realms.map<ProcessRealmData>((x) => ({
      realmPk: x.realmPk,
      programPk: x.programPk,
    }));

    await this.addToQueue(this.proposalQueue, processData);
  }

  private async addToQueue(queue: Queue, processData: ProcessRealmData[]) {
    const messages = chunkArray(processData, 100).map((data) => ({
      name: QueueProcessTypes.UPDATE_PROCESS,
      data: {
        entities: data,
      },
    }));
    await queue.addBulk(messages);
  }
}

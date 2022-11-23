import { NOTIFICATION_QUEUE } from '@gilder/constants';
import { RealmsService } from '@gilder/gov-service-module';
import { NotificationTypes } from '@gilder/types';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { ProposalEvent } from '../types';
import { NEW_PROPOSAL } from '../utils/events';
import type { ProcessNewProposalData } from '@gilder/internal-types';

@Injectable()
export class ProposalEventListener {
  @Inject(RealmsService)
  private readonly realmsService: RealmsService;

  constructor(
    @InjectQueue(NOTIFICATION_QUEUE)
    private readonly notificationQueue: Queue,
  ) {}

  @OnEvent(NEW_PROPOSAL)
  async handleNewProposalEvent({ proposal }: ProposalEvent) {
    const realm = await this.realmsService.getBy({ realmPk: proposal.realmPk });
    await this.notificationQueue.add(NotificationTypes.NEW_PROPOSALS, {
      proposalPk: proposal.proposalPk,
      proposalName: proposal.name,
      realmName: realm.name,
      realmPk: realm.realmPk,
    } as ProcessNewProposalData);
  }
}

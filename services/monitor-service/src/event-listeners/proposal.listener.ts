import { NOTIFICATION_QUEUE } from '@gilder/constants';
import { Proposal } from '@gilder/gov-db-entities';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { ProposalEvent } from '../types';
import { NEW_PROPOSAL } from '../utils/events';

@Injectable()
export class ProposalEventListener {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue,
  ) {}

  @OnEvent(NEW_PROPOSAL)
  handleNewProposalEvent({ proposal }: ProposalEvent) {
    console.log(proposal);
  }
}

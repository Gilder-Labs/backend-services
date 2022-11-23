import { Proposal } from '@gilder/gov-db-entities';
import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NEW_PROPOSAL, UPDATED_PROPOSAL } from '../utils/events';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { ProposalEvent } from 'src/types';

@EventSubscriber()
export class ProposalSubscriber implements EntitySubscriberInterface<Proposal> {
  @Inject(EventEmitter2)
  private readonly eventEmitter: EventEmitter2;

  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Proposal;
  }

  beforeInsert(event: InsertEvent<Proposal>) {
    this.eventEmitter.emit(NEW_PROPOSAL, {
      proposal: event.entity,
    } as ProposalEvent);
  }

  beforeUpdate(event: UpdateEvent<Proposal>): void | Promise<any> {
    this.eventEmitter.emit(UPDATED_PROPOSAL, {
      proposal: event.entity,
    } as ProposalEvent);
  }
}

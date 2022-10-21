import { Proposal, Realm } from '@gilder/gov-db-entities';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class ProposalSubscriber implements EntitySubscriberInterface<Proposal> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Proposal;
  }

  beforeInsert(event: InsertEvent<Proposal>) {
    // console.log(`BEFORE PROPOSAL INSERTED: `, event.entity);
  }

  beforeUpdate(event: UpdateEvent<Proposal>): void | Promise<any> {
    // console.log(`BEFORE PROPOSAL UPDATED: `, event.entity);
  }
}

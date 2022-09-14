import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Realm } from '@gilder/db-entities';

@EventSubscriber()
export class RealmSubscriber implements EntitySubscriberInterface<Realm> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Realm;
  }

  /**
   * Called after entity insertion.
   */
  afterInsert(event: InsertEvent<Realm>) {
    console.log(`AFTER ENTITY INSERTED: `, event.entity);
  }
}

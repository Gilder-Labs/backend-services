import { Realm } from '@gilder/gov-db-entities';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class RealmSubscriber implements EntitySubscriberInterface<Realm> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Realm;
  }

  beforeInsert(event: InsertEvent<Realm>) {
    // console.log(`BEFORE REALM INSERTED: `, event.entity);
  }

  beforeUpdate(event: UpdateEvent<Realm>): void | Promise<any> {
    // console.log(`BEFORE REALM UPDATED: `, event.entity);
  }
}

import { Proposal, Realm } from '@gilder/types';

export type RealmWithProposals<TKey = string> = Realm<TKey> & {
  proposals: Proposal<TKey>[];
};

export type GetRealmArgs = {
  name?: string;
  realmPk?: string;
};

import { Proposal, Realm } from '@gilder/types';

export type RealmWithProposals<TKey = string> = Realm<TKey> & {
  proposals: Proposal<TKey>[];
};

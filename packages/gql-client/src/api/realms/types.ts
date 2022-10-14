import { Proposal, Realm } from '@gilderlabs/types';
import { PublicKey } from '@solana/web3.js';

export type RealmWithProposals<TKey = PublicKey> = Realm<TKey> & {
  proposals: Proposal<TKey>[];
};

export type GetRealmArgs = {
  name?: string;
  realmPk?: string;
};

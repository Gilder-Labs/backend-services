import { PublicKey } from '@solana/web3.js';

export interface Realm<TKey = PublicKey> {
  realmPk: TKey;
  programPk: TKey;
  name: string;
}

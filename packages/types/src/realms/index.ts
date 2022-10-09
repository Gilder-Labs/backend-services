import { PublicKey } from '@solana/web3.js';

export interface Realm {
  realmPk: PublicKey;
  programPk: PublicKey;
  name: string;
}

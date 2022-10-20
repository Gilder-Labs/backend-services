import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { RealmConfig } from '../realm-config';

export interface Realm<TKey = PublicKey, TNum = BN> {
  realmPk: TKey;
  programPk: TKey;
  name: string;
  communityMintPk: TKey;
  votingProposalCount: number;
  authorityPk?: TKey;
  config: RealmConfig<TKey, TNum>;
}

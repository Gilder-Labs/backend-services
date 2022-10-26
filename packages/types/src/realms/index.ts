import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import type { RealmConfig, RawMintMaxVoteWeightSource } from '../realm-config';

export interface Realm<
  TKey = PublicKey,
  TNum = BN,
  TMint = RawMintMaxVoteWeightSource,
> {
  realmPk: TKey;
  programPk: TKey;
  name: string;
  communityMintPk: TKey;
  votingProposalCount: number;
  authorityPk?: TKey;
  config: RealmConfig<TKey, TNum, TMint>;
}

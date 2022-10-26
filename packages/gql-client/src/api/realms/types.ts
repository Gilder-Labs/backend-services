import { Proposal, RawMintMaxVoteWeightSource, Realm } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export type RealmWithProposals<
  TKey = PublicKey,
  TNum = BN,
  TMint = RawMintMaxVoteWeightSource,
> = Realm<TKey, TNum, TMint> & {
  proposals: Proposal<TKey>[];
};

export type GetRealmArgs = {
  name?: string;
  realmPk?: string;
};

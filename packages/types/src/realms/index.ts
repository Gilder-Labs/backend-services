import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface RealmConfig<TKey = PublicKey, TNum = BN> {
  councilMintPk?: TKey;
  communityMintMaxVoteWeightSource: {
    type: number;
    value: TNum;
  };
  minCommunityTokensToCreateGovernance: TNum;
  useCommunityVoterWeightAddin: boolean;
  useMaxCommunityVoterWeightAddin: boolean;
}

export interface Realm<TKey = PublicKey, TNum = BN> {
  realmPk: TKey;
  programPk: TKey;
  name: string;
  communityMintPk: TKey;
  votingProposalCount: number;
  authorityPk?: TKey;
  config: RealmConfig<TKey, TNum>;
}

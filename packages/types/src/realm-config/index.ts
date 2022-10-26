import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export type RawMintMaxVoteWeightSource<TNum = BN> = {
  type: number;
  value: TNum;
};

export interface RealmConfig<
  TKey = PublicKey,
  TNum = BN,
  TMint = RawMintMaxVoteWeightSource<TNum>,
> {
  councilMintPk?: TKey;
  communityMintMaxVoteWeightSource: TMint;
  minCommunityTokensToCreateGovernance: TNum;
  useCommunityVoterWeightAddin: boolean;
  useMaxCommunityVoterWeightAddin: boolean;
}

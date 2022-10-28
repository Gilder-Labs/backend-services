import { MintMaxVoteWeightSource } from '@solana/spl-governance';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export type RawMintMaxVoteWeightSource<TNum = BN> = {
  type: number;
  value: TNum;
};

export interface RealmConfig<
  TKey = PublicKey,
  TNum = BN,
  TMint = MintMaxVoteWeightSource,
> {
  councilMintPk?: TKey;
  communityMintMaxVoteWeightSource: TMint;
  minCommunityTokensToCreateGovernance: TNum;
  useCommunityVoterWeightAddin: boolean;
  useMaxCommunityVoterWeightAddin: boolean;
}

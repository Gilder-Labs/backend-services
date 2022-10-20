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

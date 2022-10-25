import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface VoteChoice {
  rank: number;
  weightPercentage: number;
}

export interface Vote {
  voteType: number;
  approveChoices?: VoteChoice[];
  deny?: boolean;
  veto?: boolean;
}

export interface VoteWeight<TNum = BN> {
  yes: TNum;
  no: TNum;
}

export interface VoteRecord<TKey = PublicKey, TNum = BN> {
  accountType: number;
  proposalPk: TKey;
  programPk: TKey;
  governingTokenOwnerPk: TKey;
  isRelinquished: boolean;
  voteWeight?: VoteWeight<TNum>;
  voterWeight?: TNum;
  vote?: Vote;
  noVoteWeight?: TNum;
  yesVoteWeight?: TNum;
}

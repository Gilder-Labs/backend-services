import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface TokenOwner<TKey = PublicKey, TNum = BN> {
  ownerPk: TKey;
  governanceAccountType: number;
  realmPk: TKey;
  programPk: TKey;
  governingTokenMintPk: TKey;
  governingTokenOwnerPk: TKey;
  governingTokenDespositAmount: TNum;
  unrelinquishedVotesCount: number;
  totalVotesCount: number;
  outstandingProposalCount: number;
  governanceDelegatePk?: TKey;
}

export type Member = TokenOwner;

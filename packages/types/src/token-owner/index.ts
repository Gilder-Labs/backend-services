import { PublicKey } from '@solana/web3.js';
import { GovernanceAccountType } from '@solana/spl-governance';
import BN from 'bn.js';

export interface TokenOwner<TKey = PublicKey, TNum = BN> {
  accountType: GovernanceAccountType;
  ownerPk: TKey;
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

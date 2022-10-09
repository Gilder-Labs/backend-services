import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface TokenOwner {
  ownerPk: PublicKey;
  governanceAccountType: number;
  realmPk: PublicKey;
  governingTokenMintPk: PublicKey;
  governingTokenOwnerPk: PublicKey;
  governingTokenDespositAmount: BN;
  unrelinquishedVotesCount: number;
  totalVotesCount: number;
  outstandingProposalCount: number;
  governanceDelegatePk?: PublicKey;
}

export type Member = TokenOwner;

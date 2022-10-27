import {
  GovernanceAccountType,
  MintMaxVoteWeightSource,
} from '@solana/spl-governance';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import type { RealmConfig } from '../realm-config';

export interface Realm<
  TKey = PublicKey,
  TNum = BN,
  TMint = MintMaxVoteWeightSource,
> {
  accountType: GovernanceAccountType;
  realmPk: TKey;
  programPk: TKey;
  name: string;
  communityMintPk: TKey;
  votingProposalCount: number;
  authorityPk?: TKey;
  config: RealmConfig<TKey, TNum, TMint>;
}

import { Proposal, Realm } from '@gilder/types';
import {
  MintMaxVoteWeightSource,
  ProposalOption,
  VoteType,
} from '@solana/spl-governance';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export type RealmWithProposals<
  TKey = PublicKey,
  TNum = BN,
  TMint = MintMaxVoteWeightSource,
  TVote = VoteType,
  TOption = ProposalOption,
> = Realm<TKey, TNum, TMint> & {
  proposals: Proposal<TKey, TNum, TVote, TOption>[];
};

export type GetRealmArgs = {
  name?: string;
  realmPk?: string;
};

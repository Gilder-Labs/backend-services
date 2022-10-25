import { PublicKey } from '@solana/web3.js';

export interface Proposal<TKey = PublicKey> {
  programPk: TKey;
  proposalPk: TKey;
  governancePk: TKey;
  realmPk: TKey;
  name: string;
  state: number;
  descriptionLink?: string;
  draftAt: Date;
  signingOffAt?: Date;
  startVotingAt?: Date;
  votingCompletedAt?: Date;
  votingAt?: Date;
  estimatedVoteCompletionAt?: Date;
  closedAt?: Date;
  executingAt?: Date;
}

import { PublicKey } from '@solana/web3.js';

export interface Proposal<TKey = PublicKey> {
  proposalPk: TKey;
  programPk: TKey;
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

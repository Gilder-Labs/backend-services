import { PublicKey } from '@solana/web3.js';

export interface Proposal {
  proposalPk: PublicKey;
  programPk: PublicKey;
  realmPk: PublicKey;
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

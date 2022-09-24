export interface Proposal {
  proposalPk: string;

  governancePk: string;

  realmPk: string;

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

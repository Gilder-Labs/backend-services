import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal } from '@gilder/gov-db-entities';
import {
  ProgramAccount,
  Proposal as SolanaProposal,
  Governance as SolanaGovernance,
} from '@solana/spl-governance';
import { BaseService } from '../base.service';

@Injectable()
export class ProposalsService extends BaseService<Proposal, SolanaProposal> {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
  ) {
    super();
  }

  protected getRepo(): Repository<Proposal> {
    return this.proposalRepo;
  }

  protected mapSolanaEntityToDb(
    { account, owner, pubkey }: ProgramAccount<SolanaProposal>,
    governance: ProgramAccount<SolanaGovernance>,
  ): Proposal | Promise<Proposal> {
    let estimatedVoteCompletionAt: number | undefined = undefined;

    if (account.votingAt) {
      estimatedVoteCompletionAt =
        account.votingAt.toNumber() +
        account.getTimeToVoteEnd(governance.account);
    }

    return {
      governancePk: account.governance.toBase58(),
      programPk: owner.toBase58(),
      realmPk: governance.account.realm.toBase58(),
      proposalPk: pubkey.toBase58(),
      descriptionLink: account.descriptionLink,
      name: account.name,
      state: account.state,
      draftAt: new Date(account.draftAt.toNumber() * 1000),
      startVotingAt:
        (account.startVotingAt &&
          new Date(account.startVotingAt.toNumber() * 1000)) ??
        undefined,
      signingOffAt:
        (account.signingOffAt &&
          new Date(account.signingOffAt.toNumber() * 1000)) ??
        undefined,
      votingCompletedAt:
        (account.votingCompletedAt &&
          new Date(account.votingCompletedAt.toNumber() * 1000)) ??
        undefined,
      votingAt:
        (account.votingAt && new Date(account.votingAt.toNumber() * 1000)) ??
        undefined,
      estimatedVoteCompletionAt: estimatedVoteCompletionAt
        ? new Date(estimatedVoteCompletionAt * 1000)
        : undefined,
      closedAt:
        (account.closedAt && new Date(account.closedAt.toNumber() * 1000)) ??
        undefined,
      executingAt:
        (account.executingAt &&
          new Date(account.executingAt.toNumber() * 1000)) ??
        undefined,
    };
  }
}

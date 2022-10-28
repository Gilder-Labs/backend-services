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
import { ProposalOption } from '@gilder/types';

// Doing this cause there is a weird bug that claims options is null and throws an error
const getYesVoteOption = ({ options, voteType }: SolanaProposal) => {
  if (!voteType) {
    return null;
  }

  if (options?.length !== 1 && !voteType.isSingleChoice()) {
    return null;
  }

  return options[0];
};

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

    const yesVoteOption = getYesVoteOption(account);

    return {
      accountType: account.accountType,
      governancePk: account.governance.toBase58(),
      programPk: owner.toBase58(),
      realmPk: governance.account.realm.toBase58(),
      proposalPk: pubkey.toBase58(),
      descriptionLink: account.descriptionLink,
      name: account.name,
      state: account.state,
      executionFlags: account.executionFlags,
      governingTokenMintPk: account.governingTokenMint.toBase58(),
      instructionsCount: account.instructionsCount,
      instructionsExecutedCount: account.instructionsExecutedCount,
      instructionsNextIndex: account.instructionsNextIndex,
      isFinalState: account.isFinalState(),
      isPreVotingState: account.isPreVotingState(),
      isVoteFinalized: account.isVoteFinalized(),
      noVoteCount: account.getNoVoteCount().toString(),
      yesVoteCount: account.getYesVoteCount().toString(),
      signatoriesCount: account.signatoriesCount,
      signatoriesSignedOffCount: account.signatoriesSignedOffCount,
      stateSortRank: account.getStateSortRank(),
      stateTimestamp: new Date(account.getStateTimestamp() * 1000),
      timeToVoteEnd: account.getTimeToVoteEnd(governance.account),
      tokenOwnerRecordPk: account.tokenOwnerRecord.toBase58(),
      vetoVoteWeight: account.vetoVoteWeight?.toString(),
      // Options are jank and can be null even though the spl-governance claims it won't be
      options: account.options
        ? account.options.map<ProposalOption<string>>((o) => ({
            ...o,
            voteWeight: o.voteWeight.toString(),
          }))
        : undefined,
      voteThreshold: account.voteThreshold
        ? {
            type: account.voteThreshold.type,
            value: account.voteThreshold.value,
          }
        : undefined,
      // Vote type is jank and can be null even though the spl-governance claims it won't be
      voteType: account.voteType
        ? {
            type: account.voteType.type,
            choiceCount: account.voteType.choiceCount,
          }
        : undefined,
      voteTimeEnded: account.hasVoteTimeEnded(governance.account),
      yesVoteOption: yesVoteOption
        ? {
            ...yesVoteOption,
            voteWeight: yesVoteOption.voteWeight.toString(),
          }
        : undefined,
      abstainVoteWeight: account.abstainVoteWeight?.toString(),
      denyVoteWeight: account.denyVoteWeight?.toString(),
      maxVoteWeight: account.maxVoteWeight?.toString(),
      maxVotingTime: account.maxVotingTime ?? undefined,
      votingAtSlot: account.votingAtSlot?.toString(),
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

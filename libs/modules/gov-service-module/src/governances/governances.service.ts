import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProgramAccount,
  Governance as SolanaGovernance,
} from '@solana/spl-governance';
import { Governance } from '@gilder/gov-db-entities';
import { BaseService } from '../base.service';

@Injectable()
export class GovernancesService extends BaseService<
  Governance,
  SolanaGovernance
> {
  @InjectRepository(Governance)
  private readonly governanceRepo: Repository<Governance>;

  getRepo(): Repository<Governance> {
    return this.governanceRepo;
  }

  mapSolanaEntityToDb({
    account,
    pubkey,
    owner,
  }: ProgramAccount<SolanaGovernance>): Governance | Promise<Governance> {
    const { config } = account;
    return {
      programPk: owner.toBase58(),
      governancePk: pubkey.toBase58(),
      accountType: account.accountType,
      config: {
        communityVetoVoteThreshold: config.communityVetoVoteThreshold,
        communityVoteThreshold: config.communityVoteThreshold,
        communityVoteTipping: config.communityVoteTipping,
        councilVetoVoteThreshold: config.councilVetoVoteThreshold,
        councilVoteThreshold: config.councilVoteThreshold,
        councilVoteTipping: config.councilVoteTipping,
        maxVotingTime: config.maxVotingTime,
        minCommunityTokensToCreateProposal:
          config.minCommunityTokensToCreateProposal.toString(),
        minCouncilTokensToCreateProposal:
          config.minCouncilTokensToCreateProposal.toString(),
        minInstructionHoldUpTime: config.minInstructionHoldUpTime,
      },
      governedAccountPk: account.governedAccount.toBase58(),
      proposalCount: account.proposalCount,
      realmPk: account.realm.toBase58(),
      votingProposalCount: account.votingProposalCount,
      isAccountGovernance: account.isAccountGovernance(),
      isMintGovernance: account.isMintGovernance(),
      isProgramGovernance: account.isProgramGovernance(),
      isTokenGovernance: account.isTokenGovernance(),
    };
  }
}

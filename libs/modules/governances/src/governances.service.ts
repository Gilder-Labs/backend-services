import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import {
  ProgramAccount,
  Governance as SolanaGovernance,
} from '@solana/spl-governance';
import { Governance } from '@gilder/db-entities';

@Injectable()
export class GovernancesService {
  constructor(
    @InjectRepository(Governance)
    private readonly governanceRepo: Repository<Governance>,
  ) {}

  public getGovernanceByPk(governancePk: string) {
    return this.governanceRepo.findOne({ where: { governancePk } });
  }

  public getAllGovernances() {
    return this.governanceRepo.find();
  }

  public getAllGovernancesByRealm(realmPk: string) {
    return this.governanceRepo.find({
      where: {
        realmPk: realmPk,
      },
    });
  }

  public async addOrUpdateGovernances(
    realmPk: string,
    governances: ProgramAccount<SolanaGovernance>[],
  ): Promise<InsertResult> {
    const dbGovernances = governances.map<Partial<Governance>>((gov) => {
      const { account, pubkey } = gov;
      const { config } = account;
      return {
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
        realmPk: realmPk,
        votingProposalCount: account.votingProposalCount,
        isAccountGovernance: account.isAccountGovernance(),
        isMintGovernance: account.isMintGovernance(),
        isProgramGovernance: account.isProgramGovernance(),
        isTokenGovernance: account.isTokenGovernance(),
      };
    });

    return this.governanceRepo
      .createQueryBuilder()
      .insert()
      .into(Governance)
      .values(dbGovernances)
      .orUpdate(
        [
          'realmPk',
          'governancePk',
          'accountType',
          'config',
          'governedAccountPk',
          'proposalCount',
          'votingProposalCount',
          'isAccountGovernance',
          'isMintGovernance',
          'isProgramGovernance',
          'isTokenGovernance',
        ],
        ['governancePk'],
        {
          skipUpdateIfNoValuesChanged: true,
        },
      )
      .execute();
  }
}

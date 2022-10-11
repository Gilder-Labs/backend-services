import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Governance } from '@gilder/db-entities';
import {
  ProgramAccount,
  Governance as SolanaGovernance,
} from '@solana/spl-governance';
import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';

@Injectable()
export class GovernancesService {
  constructor(
    @InjectRepository(Governance)
    private readonly governanceRepo: Repository<Governance>,
  ) {}

  public async getAllGovernances() {
    return this.governanceRepo.find();
  }

  public async getAllGovernancesByRealm(realmPk: string) {
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
        governancePk: pubkey,
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
            config.minCommunityTokensToCreateProposal as BN,
          minCouncilTokensToCreateProposal:
            config.minCouncilTokensToCreateProposal as BN,
          minInstructionHoldUpTime: config.minInstructionHoldUpTime,
        },
        governedAccountPk: account.governedAccount,
        proposalCount: account.proposalCount,
        realmPk: new PublicKey(realmPk),
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

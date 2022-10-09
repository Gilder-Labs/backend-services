import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Proposal, Realm } from '@gilder/db-entities';
import {
  ProgramAccount,
  Proposal as SolanaProposal,
} from '@solana/spl-governance';
import { sort } from 'fast-sort';
import { ProposalRPCService } from './proposals.rpc-service';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
    private readonly proposalRPCService: ProposalRPCService,
  ) {}

  public getAllProposals() {
    return this.proposalRepo.find();
  }

  public async foundNewProposals(
    realm: Realm,
    proposals: ProgramAccount<SolanaProposal>[],
  ): Promise<{
    found: boolean;
    newProposals: ProgramAccount<SolanaProposal>[];
  }> {
    const mostRecentProposal = await this.proposalRepo.findOne({
      where: { realmPk: realm.realmPk.toBase58() },
      order: { draftAt: 'DESC' },
    });

    if (!mostRecentProposal) {
      return { found: false, newProposals: [] };
    }

    const sortedProposals = sort(proposals).desc((x) =>
      x.account.draftAt.toNumber(),
    );

    const timestamp = Math.floor(mostRecentProposal.draftAt.getTime() / 1000);
    const newerProposals = sortedProposals.filter(
      (x) => x.account.draftAt.toNumber() > timestamp,
    );
    return { found: newerProposals.length > 0, newProposals: newerProposals };
  }

  public async addOrUpdateProposals(
    realm: Pick<Realm, 'programPk' | 'realmPk'>,
    proposals: ProgramAccount<SolanaProposal>[],
  ): Promise<InsertResult> {
    const dbProposals =
      await this.proposalRPCService.convertSolanaProposalToEntity(
        realm,
        proposals,
      );
    return this.proposalRepo
      .createQueryBuilder()
      .insert()
      .into(Proposal)
      .values(dbProposals)
      .orUpdate(
        [
          'descriptionLink',
          'name',
          'state',
          'draftAt',
          'startVotingAt',
          'signingOffAt',
          'votingCompletedAt',
          'estimatedVoteCompletionAt',
          'votingAt',
          'closedAt',
          'executingAt',
        ],
        ['proposalPk'],
        {
          skipUpdateIfNoValuesChanged: true,
        },
      )
      .execute();
  }
}

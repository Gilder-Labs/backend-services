import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProgramAccount,
  VoteRecord as SolanaVoteRecord,
} from '@solana/spl-governance';
import { VoteRecord } from '@gilder/gov-db-entities';
import { BaseService } from '../base.service';

@Injectable()
export class VoteRecordsService extends BaseService<
  VoteRecord,
  SolanaVoteRecord
> {
  constructor(
    @InjectRepository(VoteRecord)
    private readonly voteRecordRepo: Repository<VoteRecord>,
  ) {
    super();
  }

  getRepo(): Repository<VoteRecord> {
    return this.voteRecordRepo;
  }

  mapSolanaEntityToDb({
    account,
    owner,
  }: ProgramAccount<SolanaVoteRecord>): VoteRecord | Promise<VoteRecord> {
    const { voteWeight, vote } = account;
    return {
      accountType: account.accountType,
      governingTokenOwnerPk: account.governingTokenOwner.toBase58(),
      isRelinquished: account.isRelinquished,
      programPk: owner.toBase58(),
      proposalPk: account.proposal.toBase58(),
      noVoteWeight: account.getNoVoteWeight()?.toString(),
      yesVoteWeight: account.getYesVoteWeight()?.toString(),
      voterWeight: account.voterWeight?.toString(),
      voteWeight: voteWeight
        ? {
            yes: voteWeight.yes?.toString(),
            no: voteWeight.no?.toString(),
          }
        : undefined,
      vote: vote
        ? {
            voteType: vote.voteType,
            approveChoices: vote.approveChoices?.map((x) => ({
              rank: x.rank,
              weightPercentage: x.weightPercentage,
            })),
            deny: vote.deny,
            veto: vote.veto,
          }
        : undefined,
    } as VoteRecord;
  }
}

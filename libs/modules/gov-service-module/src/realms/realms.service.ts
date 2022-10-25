import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Realm } from '@gilder/gov-db-entities';
import { ProgramAccount, Realm as SolanaRealm } from '@solana/spl-governance';
import { BaseService } from '../base.service';

@Injectable()
export class RealmsService extends BaseService<Realm, SolanaRealm> {
  @InjectRepository(Realm)
  private readonly realmRepo: Repository<Realm>;

  getRepo(): Repository<Realm> {
    return this.realmRepo;
  }

  mapSolanaEntityToDb({
    account,
    owner,
    pubkey,
  }: ProgramAccount<SolanaRealm>): Promise<Realm> | Realm {
    const { config } = account;
    return {
      name: account.name,
      programPk: owner.toBase58(),
      realmPk: pubkey.toBase58(),
      authorityPk: account.authority?.toBase58(),
      communityMintPk: account.communityMint.toBase58(),
      votingProposalCount: account.votingProposalCount,
      config: {
        useCommunityVoterWeightAddin: config.useCommunityVoterWeightAddin,
        useMaxCommunityVoterWeightAddin: config.useMaxCommunityVoterWeightAddin,
        councilMintPk: config.councilMint?.toBase58(),
        minCommunityTokensToCreateGovernance:
          config.minCommunityTokensToCreateGovernance.toString(),
        communityMintMaxVoteWeightSource: {
          type: config.communityMintMaxVoteWeightSource.type,
          value: config.communityMintMaxVoteWeightSource.value.toString(),
        },
      },
    };
  }
}

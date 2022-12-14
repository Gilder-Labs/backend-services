import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenOwner } from '@gilder/gov-db-entities';
import { ProgramAccount, TokenOwnerRecord } from '@solana/spl-governance';
import { BaseService } from '../base.service';

@Injectable()
export class TokenOwnersService extends BaseService<
  TokenOwner,
  TokenOwnerRecord
> {
  constructor(
    @InjectRepository(TokenOwner)
    private readonly tokenOwnerRepo: Repository<TokenOwner>,
  ) {
    super();
  }

  getRepo(): Repository<TokenOwner> {
    return this.tokenOwnerRepo;
  }

  mapSolanaEntityToDb({
    pubkey,
    account,
    owner,
  }: ProgramAccount<TokenOwnerRecord>): TokenOwner | Promise<TokenOwner> {
    const { realm } = account;
    return {
      accountType: account.accountType,
      ownerPk: pubkey.toBase58(),
      programPk: owner.toBase58(),
      realmPk: realm.toBase58(),
      governanceDelegatePk: account.governanceDelegate?.toBase58(),
      governingTokenDespositAmount:
        account.governingTokenDepositAmount.toString(),
      governingTokenMintPk: account.governingTokenMint.toBase58(),
      governingTokenOwnerPk: account.governingTokenOwner.toBase58(),
      outstandingProposalCount: account.outstandingProposalCount,
      totalVotesCount: account.totalVotesCount,
      unrelinquishedVotesCount: account.unrelinquishedVotesCount,
    };
  }
}

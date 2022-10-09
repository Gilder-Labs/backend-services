import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { TokenOwner } from '@gilder/db-entities';
import { ProgramAccount, TokenOwnerRecord } from '@solana/spl-governance';
import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';

@Injectable()
export class TokenOwnersService {
  constructor(
    @InjectRepository(TokenOwner)
    private readonly tokenOwnerRepo: Repository<TokenOwner>,
  ) {}

  public getAllTokenOwners() {
    return this.tokenOwnerRepo.find();
  }

  public async addOrUpdateTokenOwners(
    realmPk: string,
    tokenOwnerRecords: ProgramAccount<TokenOwnerRecord>[],
  ): Promise<InsertResult> {
    const tokenOwners = tokenOwnerRecords.map<Partial<TokenOwner>>((tor) => {
      const { account, pubkey } = tor;
      return {
        ownerPk: pubkey,
        realmPk: new PublicKey(realmPk),
        governanceAccountType: account.accountType,
        governanceDelegatePk: account.governanceDelegate,
        governingTokenDespositAmount: account.governingTokenDepositAmount as BN,
        governingTokenMintPk: account.governingTokenMint,
        governingTokenOwnerPk: account.governingTokenOwner,
        outstandingProposalCount: account.outstandingProposalCount,
        totalVotesCount: account.totalVotesCount,
        unrelinquishedVotesCount: account.unrelinquishedVotesCount,
      };
    });

    return this.tokenOwnerRepo
      .createQueryBuilder()
      .insert()
      .into(TokenOwner)
      .values(tokenOwners)
      .orUpdate(
        [
          'realmPk',
          'governanceAccountType',
          'governanceDelegatePk',
          'governingTokenDespositAmount',
          'governingTokenMintPk',
          'governingTokenOwnerPk',
          'outstandingProposalCount',
          'totalVotesCount',
          'unrelinquishedVotesCount',
        ],
        ['ownerPk'],
        {
          skipUpdateIfNoValuesChanged: true,
        },
      )
      .execute();
  }
}

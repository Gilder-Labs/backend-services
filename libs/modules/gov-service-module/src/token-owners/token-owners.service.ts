import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, InsertResult, Repository } from 'typeorm';
import { TokenOwner } from '@gilder/gov-db-entities';
import { ProgramAccount, TokenOwnerRecord } from '@solana/spl-governance';
import { distinctBy } from '@gilder/utilities';

@Injectable()
export class TokenOwnersService {
  constructor(
    @InjectRepository(TokenOwner)
    private readonly tokenOwnerRepo: Repository<TokenOwner>,
  ) {}

  public getAllTokenOwners() {
    return this.tokenOwnerRepo.find();
  }

  public async getUniqueTokenOwners() {
    const tokenOwners = await this.tokenOwnerRepo.find();
    return distinctBy(tokenOwners, (x) => x.governingTokenOwnerPk);
  }

  public async getRealmTokenOwnersByBatch(
    realmPks: readonly string[],
  ): Promise<(TokenOwner | any)[]> {
    const tokenOwners = await this.getAllTokenOwnersByRealmPks(realmPks);
    return this._mapResultToIds(realmPks, tokenOwners);
  }

  private _mapResultToIds(
    realmPks: readonly string[],
    tokenOwners: TokenOwner[],
  ) {
    return realmPks.map(
      (id) =>
        tokenOwners.filter(
          (tokenOwner: TokenOwner) => tokenOwner.realmPk === id,
        ) || null,
    );
  }

  public getAllTokenOwnersByRealmPks(realmPks: readonly string[]) {
    return this.tokenOwnerRepo.find({
      where: {
        realmPk: In(realmPks as string[]),
      },
    });
  }

  public async getAllTokenOwnersInRealm(realmPk: string) {
    return this.tokenOwnerRepo.find({
      where: {
        realmPk: realmPk,
      },
    });
  }

  public async addOrUpdateTokenOwners(
    realmPk: string,
    tokenOwnerRecords: ProgramAccount<TokenOwnerRecord>[],
  ): Promise<InsertResult> {
    const tokenOwners = tokenOwnerRecords.map<Partial<TokenOwner>>((tor) => {
      const { account, pubkey } = tor;
      return {
        ownerPk: pubkey.toBase58(),
        realmPk: realmPk,
        governanceAccountType: account.accountType,
        governanceDelegatePk: account.governanceDelegate?.toBase58(),
        governingTokenDespositAmount:
          account.governingTokenDepositAmount.toString(),
        governingTokenMintPk: account.governingTokenMint.toBase58(),
        governingTokenOwnerPk: account.governingTokenOwner.toBase58(),
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

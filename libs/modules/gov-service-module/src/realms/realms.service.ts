import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, InsertResult, Repository } from 'typeorm';
import { Realm } from '@gilder/gov-db-entities';
import { ProgramAccount, Realm as SolanaRealm } from '@solana/spl-governance';

@Injectable()
export class RealmsService {
  constructor(
    @InjectRepository(Realm)
    private readonly realmRepo: Repository<Realm>,
  ) {}

  public async getRealmByRealmPubKey(pubKey: string) {
    const results = await this.getRealmsByRealmPubKey([pubKey]);
    return results[0];
  }

  public getRealmsByRealmPubKey(pubKeys: string[]) {
    return this.realmRepo.find({
      select: ['realmPk', 'programPk', 'name'],
      where: {
        realmPk: In(pubKeys),
      },
    });
  }

  public addOrUpdateRealms(
    realms: ProgramAccount<SolanaRealm>[],
  ): Promise<InsertResult> {
    const dbRealms = realms
      .filter((x) => !!x.pubkey && !!x.owner)
      .map<Partial<Realm>>((x) => ({
        name: x.account.name,
        programPk: x.owner.toBase58(),
        realmPk: x.pubkey.toBase58(),
        authorityPk: x.account.authority?.toBase58(),
        communityMintPk: x.account.communityMint.toBase58(),
        votingProposalCount: x.account.votingProposalCount,
        config: {
          useCommunityVoterWeightAddin:
            x.account.config.useCommunityVoterWeightAddin,
          useMaxCommunityVoterWeightAddin:
            x.account.config.useMaxCommunityVoterWeightAddin,
          councilMintPk: x.account.config.councilMint?.toBase58(),
          minCommunityTokensToCreateGovernance:
            x.account.config.minCommunityTokensToCreateGovernance.toString(),
          communityMintMaxVoteWeightSource: {
            type: x.account.config.communityMintMaxVoteWeightSource.type,
            value:
              x.account.config.communityMintMaxVoteWeightSource.value.toString(),
          },
        },
      }));

    return this.realmRepo
      .createQueryBuilder()
      .insert()
      .into(Realm)
      .values(dbRealms)
      .orUpdate(['name'], ['realmPk'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .execute();
  }

  public async getRealmByName(name: string) {
    return this.realmRepo.findOneBy({
      name,
    });
  }

  public async getRealmByPubKey(pubKey: string) {
    return this.realmRepo.findOneBy({ realmPk: pubKey });
  }

  public async getRealmsByBatch(
    programPks: readonly string[],
  ): Promise<(Realm | any)[]> {
    const realms = await this.getRealmsByProgramPks(programPks);
    return this._mapResultToIds(programPks, realms);
  }

  private _mapResultToIds(realmPks: readonly string[], realms: Realm[]) {
    return realmPks.map(
      (id) => realms.filter((realm: Realm) => realm.programPk === id) || null,
    );
  }

  public getRealmsByProgramPks(programPks: readonly string[]) {
    return this.realmRepo.find({
      where: {
        programPk: In(programPks as string[]),
      },
    });
  }

  public getRealmsByPubKey(pubKeys: string[]) {
    return this.realmRepo.find({
      where: {
        realmPk: In(pubKeys),
      },
    });
  }

  public getAllRealms(select?: Pick<FindManyOptions<Realm>, 'select'>) {
    return this.realmRepo.find({ ...select });
  }
}

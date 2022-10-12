import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, InsertResult, Repository } from 'typeorm';
import { Realm } from '@gilder/db-entities';
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

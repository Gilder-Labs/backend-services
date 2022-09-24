import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Realm } from '@gilder/db-entities';

@Injectable()
export class RealmsService {
  constructor(
    @InjectRepository(Realm) private readonly realmRepo: Repository<Realm>,
  ) {}

  public async getRealmByRealmPubKey(pubKey: string) {
    const results = await this.getRealmsByRealmPubKey([pubKey]);
    return results[0];
  }

  public getRealmsByRealmPubKey(pubKeys: string[]) {
    return this.realmRepo.find({
      select: ['realmPk', 'governancePk', 'name'],
      where: {
        realmPk: In(pubKeys),
      },
    });
  }
}

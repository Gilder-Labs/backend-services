import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Realm } from '@gilder/db-entities';

@Injectable()
export class RealmsService {
  constructor(
    @InjectRepository(Realm) private readonly realmRepo: Repository<Realm>,
  ) {}

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

  public getAllRealms() {
    return this.realmRepo.find();
  }
}

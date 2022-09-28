import { Realm } from '@gilder/db-entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  getRealms,
  ProgramAccount,
  Realm as SolanaRealm,
} from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { RealmsRestService } from './realms.rest-service';
import { getConnection } from 'src/utils';
import { In, InsertResult, Repository } from 'typeorm';

const mainSplGovernanceProgram = new PublicKey(
  'GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw',
);

@Injectable()
export class RealmsService {
  private readonly logger = new Logger(RealmsService.name);
  private readonly connection: Connection;

  constructor(
    @InjectRepository(Realm)
    private readonly realmRepo: Repository<Realm>,
    private readonly realmsRestService: RealmsRestService,
  ) {
    this.connection = getConnection();
  }

  public async getAllRealmsFromSolana() {
    const governancePrograms = await this.getSplGovernancePrograms();
    let realms: ProgramAccount<SolanaRealm>[] = [];
    for (const program of governancePrograms) {
      const result = await getRealms(this.connection, program);
      realms = [...realms, ...result];
    }
    return realms;
  }

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
        programPk: x.owner?.toBase58(),
        realmPk: x.pubkey?.toBase58(),
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

  private async getSplGovernancePrograms(): Promise<PublicKey[]> {
    try {
      const splGovernancePrograms =
        await this.realmsRestService.getSplGovernancePrograms();
      const allSplGovernancePrograms = [
        ...new Set([
          ...splGovernancePrograms.map((it) => it.toBase58()),
          mainSplGovernanceProgram.toBase58(),
        ]),
      ];
      return allSplGovernancePrograms.map((it) => new PublicKey(it));
    } catch (e) {
      const error = e as Error;
      this.logger.error(
        `Failed to get spl governance programs, reason: ${error.message} `,
      );
      return [mainSplGovernanceProgram];
    }
  }
}

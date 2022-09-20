import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PublicKey } from '@solana/web3.js';
import { RealmsRestService } from 'src/rest-services';
import { getRealms, ProgramAccount, Realm } from '@solana/spl-governance';
import { getConnection } from 'src/utils';
import { Repository } from 'typeorm';
import { Realm as DbRealm } from '@gilder/db-entities';
import { InjectRepository } from '@nestjs/typeorm';

const mainSplGovernanceProgram = new PublicKey(
  'GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw',
);

@Injectable()
export class RealmsMonitorService {
  private readonly logger = new Logger(RealmsMonitorService.name);

  constructor(
    private readonly realmsRestService: RealmsRestService,
    @InjectRepository(DbRealm)
    private readonly realmRepository: Repository<DbRealm>,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES, { name: 'checkRealms' })
  async addOrUpdateRealms() {
    const governancePrograms = await this.getSplGovernancePrograms();

    let realms: ProgramAccount<Realm>[] = [];
    for (const program of governancePrograms) {
      const result = await this.getRealms(program);
      realms = [...realms, ...result];
    }

    this.logger.log(`Found ${realms.length} realms...`);
    const dbRealms = realms.map<Partial<DbRealm>>((x) => ({
      name: x.account.name,
      owner: x.owner?.toBase58(),
      pubkey: x.pubkey?.toBase58(),
    }));
    await this.realmRepository
      .createQueryBuilder()
      .insert()
      .into(DbRealm)
      .values(dbRealms)
      .orUpdate(['name', 'owner'], ['pubkey'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .execute();
  }

  private async getRealms(program: PublicKey) {
    return await getRealms(getConnection(), program);
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

import { Injectable, Logger } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { RealmsRestService } from './realms.rest-service';
import {
  getRealms,
  ProgramAccount,
  Realm as SolanaRealm,
} from '@solana/spl-governance';

const mainSplGovernanceProgram = new PublicKey(
  'GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw',
);

@Injectable()
export class RealmsRPCService {
  private readonly logger = new Logger(RealmsRPCService.name);

  constructor(private readonly realmsRestService: RealmsRestService) {}

  public async getAllRealmsFromSolana(connection: Connection) {
    const governancePrograms = await this.getSplGovernancePrograms();
    let realms: ProgramAccount<SolanaRealm>[] = [];
    for (const program of governancePrograms) {
      const result = await getRealms(connection, program);
      realms = [...realms, ...result];
    }
    return realms;
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

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { firstValueFrom } from 'rxjs';

const splGovInstancesUrl = 'https://app.realms.today/api/splGovernancePrograms';

@Injectable()
export class RealmsRestService {
  constructor(private readonly httpService: HttpService) {}

  async getSplGovernancePrograms(): Promise<PublicKey[]> {
    const response = await firstValueFrom(
      this.httpService.get<string[]>(splGovInstancesUrl),
    );
    return response.data.map((it) => new PublicKey(it));
  }
}

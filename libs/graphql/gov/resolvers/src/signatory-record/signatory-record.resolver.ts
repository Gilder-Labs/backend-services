import { SignatoryRecordsService } from '@gilder/gov-service-module';
import { Proposal, SignatoryRecord } from '@gilder/graphql-gov-models';
import { Query, Resolver } from '@nestjs/graphql';
import { GovernanceAccountType } from '@solana/spl-governance';

@Resolver(Proposal)
export class SignatoryRecordResolver {
  constructor(
    private readonly signatoryRecordsService: SignatoryRecordsService,
  ) {}

  @Query(() => [SignatoryRecord])
  async signatoryRecords(): Promise<SignatoryRecord[]> {
    return this.signatoryRecordsService.getAll();
  }

  @Query(() => [SignatoryRecord])
  async signatoryRecordsV1(): Promise<SignatoryRecord[]> {
    return this.signatoryRecordsService.filterBy({
      accountType: GovernanceAccountType.SignatoryRecordV1,
    });
  }

  @Query(() => [SignatoryRecord])
  async signatoryRecordsV2(): Promise<SignatoryRecord[]> {
    return this.signatoryRecordsService.filterBy({
      accountType: GovernanceAccountType.SignatoryRecordV2,
    });
  }
}

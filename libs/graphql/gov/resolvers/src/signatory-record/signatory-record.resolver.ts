import { SignatoryRecordsService } from '@gilder/gov-service-module';
import { Proposal, SignatoryRecord } from '@gilder/graphql-gov-models';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(Proposal)
export class SignatoryRecordResolver {
  constructor(
    private readonly signatoryRecordsService: SignatoryRecordsService,
  ) {}

  @Query(() => [SignatoryRecord])
  async signatoryRecords(): Promise<SignatoryRecord[]> {
    return this.signatoryRecordsService.getAll();
  }
}

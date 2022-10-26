import { VoteRecordsService } from '@gilder/gov-service-module';
import { VoteRecord } from '@gilder/graphql-gov-models';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(VoteRecord)
export class VoteRecordResolver {
  constructor(private readonly voteRecordService: VoteRecordsService) {}

  @Query(() => [VoteRecord])
  async voteRecords(): Promise<VoteRecord[]> {
    return this.voteRecordService.getAll();
  }
}

import { VoteRecordsService } from '@gilder/gov-service-module';
import { VoteRecord } from '@gilder/graphql-gov-models';
import { Query, Resolver } from '@nestjs/graphql';
import { GovernanceAccountType } from '@solana/spl-governance';

@Resolver(VoteRecord)
export class VoteRecordResolver {
  constructor(private readonly voteRecordService: VoteRecordsService) {}

  @Query(() => [VoteRecord])
  async voteRecords(): Promise<VoteRecord[]> {
    return this.voteRecordService.getAll();
  }

  @Query(() => [VoteRecord])
  async voteRecordsV1(): Promise<VoteRecord[]> {
    return this.voteRecordService.filterBy({
      accountType: GovernanceAccountType.VoteRecordV1,
    });
  }

  @Query(() => [VoteRecord])
  async voteRecordsV2(): Promise<VoteRecord[]> {
    return this.voteRecordService.filterBy({
      accountType: GovernanceAccountType.VoteRecordV2,
    });
  }
}

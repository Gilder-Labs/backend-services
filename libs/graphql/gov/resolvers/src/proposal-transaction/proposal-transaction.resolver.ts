import { ProposalTransactionsService } from '@gilder/gov-service-module';
import { ProposalTransaction } from '@gilder/graphql-gov-models';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(ProposalTransaction)
export class ProposalTransactionResolver {
  constructor(
    private readonly proposalTransactionService: ProposalTransactionsService,
  ) {}

  @Query(() => [ProposalTransaction])
  async proposalTransactions(): Promise<ProposalTransaction[]> {
    return this.proposalTransactionService.getAll();
  }
}

import { ProposalTransaction } from '@gilder/gov-db-entities';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ProposalTransactionsService } from './proposal-transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProposalTransaction])],
  providers: [ProposalTransactionsService],
  exports: [ProposalTransactionsService],
})
export class ProposalTransactionsServiceModule {
  static register(dataSource?: string): DynamicModule {
    const provider: Provider<any> = {
      provide: 'PROPOSAL_TRANSACTION_SERVICE',
      useFactory: (repo) => new ProposalTransactionsService(repo),
      inject: [getRepositoryToken(ProposalTransaction, dataSource)],
    };
    return {
      module: ProposalTransactionsServiceModule,
      imports: [TypeOrmModule.forFeature([ProposalTransaction], dataSource)],
      providers: [provider],
      exports: [provider],
    };
  }
}

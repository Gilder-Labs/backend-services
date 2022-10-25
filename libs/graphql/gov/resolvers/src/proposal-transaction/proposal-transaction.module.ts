import { Module } from '@nestjs/common';
import { ProposalTransactionResolver } from './proposal-transaction.resolver';
import { ProposalTransaction } from '@gilder/gov-db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GovServiceModule,
  ProposalTransactionsService,
} from '@gilder/gov-service-module';

@Module({
  imports: [TypeOrmModule.forFeature([ProposalTransaction]), GovServiceModule],
  providers: [ProposalTransactionsService, ProposalTransactionResolver],
  exports: [ProposalTransactionResolver],
})
export class ProposalTransactionsGraphQLModule {}

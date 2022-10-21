import { ProposalTransaction } from '@gilder/gov-db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalTransactionsService } from './proposal-transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProposalTransaction])],
  providers: [ProposalTransactionsService],
  exports: [ProposalTransactionsService],
})
export class ProposalTransactionsServiceModule {}

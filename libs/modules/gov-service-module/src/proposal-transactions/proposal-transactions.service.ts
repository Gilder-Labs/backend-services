import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProgramAccount,
  ProposalTransaction as SolanaProposalTransaction,
} from '@solana/spl-governance';
import { ProposalTransaction, SignatoryRecord } from '@gilder/gov-db-entities';
import { BaseService } from '../base.service';
import { AccountMetaData } from '@gilder/types';

@Injectable()
export class ProposalTransactionsService extends BaseService<
  ProposalTransaction,
  SolanaProposalTransaction
> {
  @InjectRepository(ProposalTransaction)
  private readonly proposalTransactionRepo: Repository<ProposalTransaction>;

  getRepo(): Repository<ProposalTransaction> {
    return this.proposalTransactionRepo;
  }

  mapSolanaEntityToDb({
    account,
    owner,
  }: ProgramAccount<SolanaProposalTransaction>):
    | ProposalTransaction
    | Promise<ProposalTransaction> {
    const { instruction, instructions } = account;
    return {
      proposalPk: account.proposal.toBase58(),
      accountType: account.accountType,
      executionStatus: account.executionStatus,
      holdUpTime: account.holdUpTime,
      programPk: owner.toBase58(),
      executedAt: account.executedAt?.toString(),
      optionIndex: account.optionIndex,
      instructionIndex: account.instructionIndex,
      instruction: {
        programId: instruction?.programId.toBase58(),
        accounts: instruction?.accounts.map((x) => ({
          isSigner: x?.isSigner,
          isWritable: x?.isWritable,
          pubkey: x?.pubkey.toBase58(),
        })),
      },
      instructions: instructions.map((instruct) => ({
        accounts: instruct.accounts.map<AccountMetaData<string>>((a) => ({
          isSigner: a.isSigner,
          isWritable: a.isWritable,
          pubkey: a.pubkey.toBase58(),
        })),
        programId: instruct.programId.toBase58(),
      })),
    } as ProposalTransaction;
  }
}

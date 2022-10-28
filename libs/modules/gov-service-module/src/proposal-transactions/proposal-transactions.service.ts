import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProgramAccount,
  ProposalTransaction as SolanaProposalTransaction,
} from '@solana/spl-governance';
import { ProposalTransaction } from '@gilder/gov-db-entities';
import { BaseService } from '../base.service';
import { AccountMetadata } from '@gilder/types';

@Injectable()
export class ProposalTransactionsService extends BaseService<
  ProposalTransaction,
  SolanaProposalTransaction
> {
  constructor(
    @InjectRepository(ProposalTransaction)
    private readonly proposalTransactionRepo: Repository<ProposalTransaction>,
  ) {
    super();
  }

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
      executedAt: account.executedAt
        ? new Date(account.executedAt.toNumber() * 1000)
        : undefined,
      optionIndex: account.optionIndex,
      instructionIndex: account.instructionIndex,
      instruction: account.instruction
        ? {
            programId: instruction?.programId.toBase58(),
            accounts: instruction?.accounts.map((x) => ({
              isSigner: x?.isSigner,
              isWritable: x?.isWritable,
              pubkey: x?.pubkey.toBase58(),
            })),
          }
        : undefined,
      instructions: instructions.map((instruct) => ({
        accounts: instruct.accounts.map<AccountMetadata<string>>((a) => ({
          isSigner: a.isSigner,
          isWritable: a.isWritable,
          pubkey: a.pubkey.toBase58(),
        })),
        programId: instruct.programId.toBase58(),
      })),
    } as ProposalTransaction;
  }
}

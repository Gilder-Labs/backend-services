import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProgramAccount,
  SignatoryRecord as SolanaSignatoryRecord,
} from '@solana/spl-governance';
import { SignatoryRecord } from '@gilder/gov-db-entities';
import { BaseService } from '../base.service';

@Injectable()
export class SignatoryRecordsService extends BaseService<
  SignatoryRecord,
  SolanaSignatoryRecord
> {
  @InjectRepository(SignatoryRecord)
  private readonly signatoryRecordRepo: Repository<SignatoryRecord>;

  getRepo(): Repository<SignatoryRecord> {
    return this.signatoryRecordRepo;
  }

  mapSolanaEntityToDb({
    account,
    owner,
  }: ProgramAccount<SolanaSignatoryRecord>):
    | SignatoryRecord
    | Promise<SignatoryRecord> {
    return {
      accountType: account.accountType,
      programPk: owner.toBase58(),
      proposalPk: account.proposal.toBase58(),
      signatoryPk: account.signatory.toBase58(),
      signedOff: account.signedOff,
    };
  }
}

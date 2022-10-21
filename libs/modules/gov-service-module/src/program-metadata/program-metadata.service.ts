import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProgramAccount,
  ProgramMetadata as SolanaProgramMetadata,
} from '@solana/spl-governance';
import { ProgramMetadata } from '@gilder/gov-db-entities';
import { BaseService } from '../base.service';

@Injectable()
export class ProgramMetadataService extends BaseService<
  ProgramMetadata,
  SolanaProgramMetadata
> {
  @InjectRepository(ProgramMetadata)
  private readonly programMetadataRepo: Repository<ProgramMetadata>;

  getRepo(): Repository<ProgramMetadata> {
    return this.programMetadataRepo;
  }

  mapSolanaEntityToDb({
    account,
    owner,
  }: ProgramAccount<SolanaProgramMetadata>):
    | ProgramMetadata
    | Promise<ProgramMetadata> {
    return {
      accountType: account.accountType,
      programPk: owner.toBase58(),
      updatedAt: new Date(account.updatedAt.toNumber() * 1000),
      version: account.version,
    } as ProgramMetadata;
  }
}

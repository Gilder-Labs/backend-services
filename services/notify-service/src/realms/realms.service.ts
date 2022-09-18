import { ResourceId } from '@dialectlabs/monitor';
import { ProgramAccount, Proposal, Realm } from '@solana/spl-governance';
import { PublicKey } from '@solana/web3.js';
import { Injectable, Logger } from '@nestjs/common';

export interface RealmData {
  realm: ProgramAccount<Realm>;
  subscribers: ResourceId[];
  proposals: ProposalWithMetadata[];
}

export interface ProposalWithMetadata {
  proposal: ProgramAccount<Proposal>;
  author?: PublicKey;
}

export interface ProposalData {
  proposal: ProgramAccount<Proposal>;
  // author: PublicKey;
  realm: ProgramAccount<Realm>;
  realmSubscribers: ResourceId[];
}

@Injectable()
export class RealmsService {
  private readonly logger = new Logger(RealmsService.name);
}

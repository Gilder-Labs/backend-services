import { GovernanceAccountType, ProgramAccount } from '@solana/spl-governance';
import { PublicKey } from '@solana/web3.js';

export interface RawAccountData {
  executable: boolean;
  /** Identifier of the program that owns the account */
  owner: PublicKey | string;
  /** Number of lamports assigned to the account */
  lamports: number;
  /** Optional data assigned to the account */
  data: Buffer | [any, string];
  /** Optional rent epoch info for account */
  rentEpoch?: number;
}

export interface ParsedAccount<T = any> {
  type: GovernanceAccountType;
  account: ProgramAccount<T>;
}

export interface RawAccount {
  account: RawAccountData;
  pubkey: string;
}

export enum AccountTypes {
  Governance = 'governance',
  Proposal = 'proposal',
  TokenOwner = 'token-owner',
  Realm = 'realm',
  ProoposalTransaction = 'proposal-transaction',
  SignatoryRecord = 'signatory-record',
  VoteRecord = 'vote-record',
  ProgramMetadata = 'program-metadata',
  RealmConfig = 'realm-config',
}
export type AccountType = `${AccountTypes}`;

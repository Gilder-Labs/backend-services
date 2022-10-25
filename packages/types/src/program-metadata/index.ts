import { PublicKey } from '@solana/web3.js';

export interface ProgramMetadata<TKey = PublicKey> {
  programPk: TKey;
  accountType: number;
  updatedAt: Date;
  version: string;
}

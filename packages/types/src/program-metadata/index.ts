import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface PrograMetadata<TKey = PublicKey, TNum = BN> {
  programPk: TKey;
  accountType: number;
  updatedAt: TNum;
  version: string;
}

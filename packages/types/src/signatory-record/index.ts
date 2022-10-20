import { PublicKey } from '@solana/web3.js';

export interface SignatoryRecord<TKey = PublicKey> {
  accountType: number;
  proposalPk: TKey;
  programPk: TKey;
  signatoryPk: TKey;
  signedOff: boolean;
}

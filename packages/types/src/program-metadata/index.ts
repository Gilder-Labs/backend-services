import BN from 'bn.js';

export interface PrograMetadata<TNum = BN> {
  accountType: number;
  updatedAt: TNum;
  version: string;
}

import {
  GovernanceAccountParser,
  ProgramAccount,
  Realm,
} from '@solana/spl-governance';
import { AccountInfo, PublicKey } from '@solana/web3.js';

export const tryGetRealmData = (
  pubkey: PublicKey,
  info: AccountInfo<Buffer>,
): ProgramAccount<Realm> | null => {
  try {
    return GovernanceAccountParser(Realm)(pubkey, info);
  } catch {
    return null;
  }
};

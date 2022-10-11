import {
  GovernanceAccountParser,
  ProgramAccount,
  Proposal,
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

export const tryGetProposalData = (
  pubkey: PublicKey,
  info: AccountInfo<Buffer>,
): ProgramAccount<Proposal> | null => {
  try {
    return GovernanceAccountParser(Proposal)(pubkey, info);
  } catch {
    return null;
  }
};

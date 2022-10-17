import {
  GovernanceAccountParser,
  ProgramAccount,
  Proposal,
  ProposalState,
  Realm,
} from '@solana/spl-governance';
import { AccountInfo, PublicKey } from '@solana/web3.js';

/*
 * I found that there were realms with names like '\u0000' that I want to filter out
 */
const realmRegex = /\0/g;

export const tryGetRealmData = (
  pubkey: PublicKey,
  info: AccountInfo<Buffer>,
): ProgramAccount<Realm> | null => {
  try {
    const realm = GovernanceAccountParser(Realm)(pubkey, info);
    if (realm?.account.name?.replace(realmRegex, '')) {
      return realm;
    }
    return null;
  } catch {
    return null;
  }
};

export const tryGetProposalData = (
  pubkey: PublicKey,
  info: AccountInfo<Buffer>,
): ProgramAccount<Proposal> | null => {
  try {
    const proposal = GovernanceAccountParser(Proposal)(pubkey, info);
    if (proposal?.account.name && proposal?.account.state in ProposalState) {
      return proposal;
    }
    return null;
  } catch {
    return null;
  }
};

import {
  deserializeBorsh,
  getGovernanceSchemaForAccount,
  Governance,
  GovernanceAccountType,
  ProgramAccount,
  ProgramMetadata,
  Proposal,
  ProposalTransaction,
  Realm,
  RealmConfig,
  SignatoryRecord,
  TokenOwnerRecord,
  VoteRecord,
} from '@solana/spl-governance';
import { PublicKey } from '@solana/web3.js';
import { ParsedAccount, RawAccountData } from './types';

const tryParseAccount = <T = any>(
  pubkey: string,
  rawAccount: RawAccountData,
): ParsedAccount<T> | null => {
  const getSchema = getGovernanceSchemaForAccount;
  const data =
    rawAccount.data instanceof Buffer
      ? rawAccount.data
      : Buffer.from(rawAccount.data[0], 'base64');
  const accountType: GovernanceAccountType = data[0];
  let classType: any;

  switch (accountType) {
    case GovernanceAccountType.GovernanceV1:
    case GovernanceAccountType.GovernanceV2:
    case GovernanceAccountType.TokenGovernanceV1:
    case GovernanceAccountType.TokenGovernanceV2:
    case GovernanceAccountType.MintGovernanceV1:
    case GovernanceAccountType.MintGovernanceV2:
    case GovernanceAccountType.ProgramGovernanceV1:
    case GovernanceAccountType.ProgramGovernanceV2:
      classType = Governance;
      break;
    case GovernanceAccountType.ProposalV1:
    case GovernanceAccountType.ProposalV2:
      classType = Proposal;
      break;
    case GovernanceAccountType.VoteRecordV1:
    case GovernanceAccountType.VoteRecordV2:
      classType = VoteRecord;
      break;
    case GovernanceAccountType.RealmV1:
    case GovernanceAccountType.RealmV2:
      classType = Realm;
      break;
    case GovernanceAccountType.TokenOwnerRecordV1:
    case GovernanceAccountType.TokenOwnerRecordV2:
      classType = TokenOwnerRecord;
      break;
    case GovernanceAccountType.SignatoryRecordV1:
    case GovernanceAccountType.SignatoryRecordV2:
      classType = SignatoryRecord;
      break;
    case GovernanceAccountType.ProgramMetadata:
      classType = ProgramMetadata;
      break;
    case GovernanceAccountType.ProposalTransactionV2:
      classType = ProposalTransaction;
      break;
    case GovernanceAccountType.RealmConfig: // Gonna skip this for now...???
    default:
      return null;
  }

  const account: ProgramAccount<any> = {
    owner: new PublicKey(rawAccount.owner),
    pubkey: new PublicKey(pubkey),
    account: deserializeBorsh(getSchema(accountType), classType, data),
  };

  return {
    account,
    type: accountType,
  };
};

export { tryParseAccount as parseAccount };

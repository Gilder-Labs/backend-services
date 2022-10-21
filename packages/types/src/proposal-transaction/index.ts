import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface AccountMetaData<TKey = PublicKey> {
  pubkey: TKey;
  isSigner: boolean;
  isWritable: boolean;
}

export interface InstructionData<TKey = PublicKey> {
  programId: TKey;
  accounts: AccountMetaData<TKey>[];
}

export interface ProposalTransaction<TKey = PublicKey, TNum = BN> {
  accountType: number;
  proposalPk: TKey;
  programPk: TKey;
  instructionIndex: number;
  instruction: InstructionData<TKey>;
  optionIndex: number;
  instructions: InstructionData<TKey>[];
  holdUpTime: number;
  executedAt?: TNum;
  executionStatus: number;
}

import { PublicKey } from '@solana/web3.js';

export interface AccountMetadata<TKey = PublicKey> {
  pubkey: TKey;
  isSigner: boolean;
  isWritable: boolean;
}

export interface InstructionData<TKey = PublicKey> {
  programId: TKey;
  accounts: AccountMetadata<TKey>[];
}

export interface ProposalTransaction<TKey = PublicKey> {
  accountType: number;
  proposalPk: TKey;
  programPk: TKey;
  instructionIndex: number;
  instruction?: InstructionData<TKey>;
  optionIndex: number;
  instructions: InstructionData<TKey>[];
  holdUpTime: number;
  executedAt?: Date;
  executionStatus: number;
}

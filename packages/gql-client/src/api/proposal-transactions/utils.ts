import { ProposalTransaction, InstructionData } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';

export const transformProposalTransactions = ({
  programPk,
  proposalPk,
  instructions,
  instruction,
  executedAt,
  ...rest
}: ProposalTransaction<string>): ProposalTransaction => {
  return {
    ...rest,
    proposalPk: new PublicKey(proposalPk),
    programPk: new PublicKey(programPk),
    instructions: instructions.map<InstructionData>((i) => ({
      accounts: i.accounts.map((a) => ({
        isSigner: a.isSigner,
        isWritable: a.isWritable,
        pubkey: new PublicKey(a.pubkey),
      })),
      programId: new PublicKey(i.programId),
    })),
    executedAt: executedAt ? new Date(executedAt) : undefined,
    instruction: instruction?.programId
      ? {
          accounts:
            instruction.accounts.map((a) => ({
              isSigner: a.isSigner,
              isWritable: a.isWritable,
              pubkey: new PublicKey(a.pubkey),
            })) ?? [],
          programId: new PublicKey(instruction.programId),
        }
      : undefined,
  };
};

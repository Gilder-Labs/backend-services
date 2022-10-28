import { SignatoryRecord } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';

export const transformSignatoryRecord = ({
  programPk,
  proposalPk,
  signatoryPk,
  ...rest
}: SignatoryRecord<string>): SignatoryRecord => {
  return {
    ...rest,
    proposalPk: new PublicKey(proposalPk),
    programPk: new PublicKey(programPk),
    signatoryPk: new PublicKey(signatoryPk),
  };
};

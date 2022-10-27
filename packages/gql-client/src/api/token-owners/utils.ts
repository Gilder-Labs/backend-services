import { TokenOwner } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';
import * as BN from 'bn.js';

export const transformTokenOwner = (
  tokenOwner: TokenOwner<string, string>,
): TokenOwner => {
  const {
    realmPk,
    programPk,
    ownerPk,
    governingTokenMintPk,
    governanceDelegatePk,
    governingTokenOwnerPk,
    governingTokenDespositAmount,
    ...rest
  } = tokenOwner;
  return {
    ...rest,
    programPk: new PublicKey(programPk),
    realmPk: new PublicKey(realmPk),
    ownerPk: new PublicKey(ownerPk),
    governingTokenMintPk: new PublicKey(governingTokenMintPk),
    governingTokenOwnerPk: new PublicKey(governingTokenOwnerPk),
    governanceDelegatePk: governanceDelegatePk
      ? new PublicKey(governanceDelegatePk)
      : undefined,
    governingTokenDespositAmount: new BN.BN(governingTokenDespositAmount),
  };
};

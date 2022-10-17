import { TokenOwner } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';

export const transformTokenOwner = (
  tokenOwner: TokenOwner<string>,
): TokenOwner => {
  const {
    realmPk,
    ownerPk,
    governingTokenMintPk,
    governanceDelegatePk,
    governingTokenOwnerPk,
    ...rest
  } = tokenOwner;
  return {
    ...rest,
    realmPk: new PublicKey(realmPk),
    ownerPk: new PublicKey(ownerPk),
    governingTokenMintPk: new PublicKey(governingTokenMintPk),
    governingTokenOwnerPk: new PublicKey(governingTokenOwnerPk),
    governanceDelegatePk: governanceDelegatePk
      ? new PublicKey(governanceDelegatePk)
      : undefined,
  };
};

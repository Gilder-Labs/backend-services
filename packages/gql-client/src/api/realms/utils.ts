import { Realm } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';

export const transformRealm = ({
  realmPk,
  programPk,
  authorityPk,
  communityMintPk,
  config,
  ...rest
}: Realm<string>): Realm => {
  return {
    ...rest,
    realmPk: new PublicKey(realmPk),
    programPk: new PublicKey(programPk),
    authorityPk: authorityPk ? new PublicKey(authorityPk) : undefined,
    communityMintPk: new PublicKey(communityMintPk),
    config: {
      ...config,
      councilMintPk: config.councilMintPk
        ? new PublicKey(config.councilMintPk)
        : undefined,
    },
  };
};

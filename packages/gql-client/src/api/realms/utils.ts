import { Realm } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';
import * as BN from 'bn.js';
import { MintMaxVoteWeightSource } from '@solana/spl-governance';

export const transformRealm = ({
  realmPk,
  programPk,
  authorityPk,
  communityMintPk,
  config,
  ...rest
}: Realm<string>): Realm<PublicKey, BN, MintMaxVoteWeightSource> => {
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
      minCommunityTokensToCreateGovernance: new BN.BN(
        config.minCommunityTokensToCreateGovernance,
      ),
      communityMintMaxVoteWeightSource: new MintMaxVoteWeightSource({
        type: config.communityMintMaxVoteWeightSource.type,
        value: new BN.BN(config.communityMintMaxVoteWeightSource.value),
      }),
    },
  };
};

import { RawMintMaxVoteWeightSource, Realm } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';
import * as BN from 'bn.js';
import { MintMaxVoteWeightSource } from '@solana/spl-governance';

export const transformRealm = <
  TReturn extends Partial<
    Realm<PublicKey, BN, MintMaxVoteWeightSource>
  > = Realm,
>({
  realmPk,
  programPk,
  authorityPk,
  communityMintPk,
  config,
  ...rest
}: Realm<string, string, RawMintMaxVoteWeightSource<string>>): TReturn => {
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
  } as TReturn;
};

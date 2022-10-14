import { Governance } from '@gilderlabs/types';
import { PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';

export const transformGovernance = ({
  realmPk,
  governancePk,
  governedAccountPk,
  config,
  ...rest
}: Governance<string, string>): Governance => {
  const {
    minCommunityTokensToCreateProposal,
    minCouncilTokensToCreateProposal,
    ...configRest
  } = config;
  return {
    ...rest,
    realmPk: new PublicKey(realmPk),
    governancePk: new PublicKey(governancePk),
    governedAccountPk: new PublicKey(governedAccountPk),
    config: {
      ...configRest,
      minCommunityTokensToCreateProposal: new BN(
        minCommunityTokensToCreateProposal,
      ),
      minCouncilTokensToCreateProposal: new BN(
        minCouncilTokensToCreateProposal,
      ),
    },
  };
};

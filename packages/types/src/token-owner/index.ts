export interface TokenOwner {
  ownerPk: string;
  governanceAccountType: number;
  realmPk: string;
  governingTokenMintPk: string;
  governingTokenOwnerPk: string;
  governingTokenDespositAmount: number;
  unrelinquishedVotesCount: number;
  totalVotesCount: number;
  outstandingProposalCount: number;
  governanceDelegatePk: string;
}

export type Member = TokenOwner;

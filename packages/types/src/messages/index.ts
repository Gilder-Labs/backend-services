export type ProcessNewProposalData = {
  proposalPk: string;
  proposalName: string;
  realmPk: string;
  realmName: string;
};

export type BulkProcessRealmProposals = {
  realms: ProcessRealmProposals[];
};

export type ProcessRealmProposals = {
  programPk: string;
  realmPk: string;
};

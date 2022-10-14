export type ProcessNewProposalData = {
  proposalPk: string;
  proposalName: string;
  realmPk: string;
  realmName: string;
};

export type BulkProcessUpdates<T> = {
  entities: T[];
};

export type ProcessRealmData = {
  programPk: string;
  realmPk: string;
};

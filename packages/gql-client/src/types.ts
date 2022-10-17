import { DocumentNode } from 'graphql';

export type QueryOptions<T = undefined> = {
  query: DocumentNode;
  variables?: T;
};

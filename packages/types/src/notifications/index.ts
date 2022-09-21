export type NotificationType = 'newProposals';

export type NotifyProposalData = { realmId: string; proposalId: string };

export interface ExpoNotification<T = any> {
  to: string;
  title: string;
  sound?: 'default';
  body: string;
  data: T;
}

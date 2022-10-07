export enum NotificationTypes {
  NEW_PROPOSALS = 'newProposals',
}

export type NotificationType = `${NotificationTypes}`;

export type NotifyProposalData = { realmId: string; proposalId: string };

export interface ExpoNotification<T = any> {
  to: string;
  title: string;
  sound?: 'default';
  body: string;
  data: T;
}

export interface NotificationSubscription {
  id: string;
  mobileToken: string;
  type: NotificationType;
  realmPk: string;
  isActive: boolean;
}

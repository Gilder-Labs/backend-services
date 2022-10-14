export enum NotificationTypes {
  NEW_PROPOSALS = 'newProposals',
}

export type NotificationType = `${NotificationTypes}`;

export interface NotificationSubscription {
  id: string;
  mobileToken: string;
  type: NotificationType;
  realmPk: string;
  isActive: boolean;
}

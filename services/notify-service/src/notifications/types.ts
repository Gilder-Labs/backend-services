export type NotificationType = 'newProposals';

export interface NotifyData {
  type: NotificationType;
  mobileToken: string;
  realm: string;
}

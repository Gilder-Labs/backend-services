import type { NotificationType } from '@gilder/types';

export interface NotifyData {
  type: NotificationType;
  mobileToken: string;
  realmPk: string;
}

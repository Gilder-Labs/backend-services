import type { NotificationType } from '@gilderlabs/types';

export interface NotifyData {
  type: NotificationType;
  mobileToken: string;
  realmPk: string;
}

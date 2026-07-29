export type NotificationType =
  | 'JobAssigned'
  | 'JobStatusChanged'
  | 'BillPaid'
  | 'JobCreated'
  | 'JobOverdue'
  | 'BillUnpaid';

export interface NotificationDto {
  id: string;
  type: NotificationType | string;
  message: string;
  isRead: boolean;
  createdAtUtc: string;
}

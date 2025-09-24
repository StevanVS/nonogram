export interface ToastNotification {
  id?: number,
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
  title?: string;
  message: string;
  time?: number;
}

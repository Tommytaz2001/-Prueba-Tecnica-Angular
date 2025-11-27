/**
 * Tipos de notificación
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Interface para notificaciones
 */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

/**
 * Opciones para crear una notificación
 */
export interface NotificationOptions {
  type: NotificationType;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

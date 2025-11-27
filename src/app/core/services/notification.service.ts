import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification, NotificationOptions, NotificationType } from '@core/interfaces/notification.interface';

/**
 * Servicio para manejo de notificaciones
 * Implementa el patrón Observer para notificaciones reactivas
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notifications$ = new BehaviorSubject<Notification[]>([]);
  private notificationIdCounter = 0;

  /**
   * Obtiene el observable de notificaciones
   */
  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, duration = 3000): void {
    this.show({
      type: NotificationType.SUCCESS,
      message,
      duration,
      dismissible: true,
    });
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, duration = 5000): void {
    this.show({
      type: NotificationType.ERROR,
      message,
      duration,
      dismissible: true,
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, duration = 4000): void {
    this.show({
      type: NotificationType.WARNING,
      message,
      duration,
      dismissible: true,
    });
  }

  /**
   * Muestra una notificación de información
   */
  info(message: string, duration = 3000): void {
    this.show({
      type: NotificationType.INFO,
      message,
      duration,
      dismissible: true,
    });
  }

  /**
   * Muestra una notificación personalizada
   */
  show(options: NotificationOptions): void {
    const notification: Notification = {
      id: this.generateId(),
      type: options.type,
      message: options.message,
      duration: options.duration ?? 3000,
      dismissible: options.dismissible ?? true,
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([...currentNotifications, notification]);

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.dismiss(notification.id);
      }, notification.duration);
    }
  }

  /**
   * Cierra una notificación específica
   */
  dismiss(id: string): void {
    const currentNotifications = this.notifications$.value;
    const filteredNotifications = currentNotifications.filter((n) => n.id !== id);
    this.notifications$.next(filteredNotifications);
  }

  /**
   * Cierra todas las notificaciones
   */
  dismissAll(): void {
    this.notifications$.next([]);
  }

  /**
   * Genera un ID único para la notificación
   */
  private generateId(): string {
    return `notification-${++this.notificationIdCounter}-${Date.now()}`;
  }
}

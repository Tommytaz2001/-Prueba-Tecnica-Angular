import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Notification } from '@core/interfaces/notification.interface';
import { NotificationService } from '@core/services/notification.service';

/**
 * Componente para mostrar notificaciones
 * Implementa SRP: solo se encarga de mostrar notificaciones
 */
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  notifications$!: Observable<Notification[]>;

  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationService.getNotifications();
  }

  /**
   * Cierra una notificación
   */
  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  /**
   * Obtiene la clase CSS según el tipo de notificación
   */
  getNotificationClass(type: string): string {
    return `notification notification--${type}`;
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de loading/spinner
 * Implementa SRP: solo se encarga de mostrar un indicador de carga
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() message = 'Cargando...';
  @Input() overlay = false;

  /**
   * Obtiene la clase CSS según el tamaño
   */
  getSizeClass(): string {
    return `spinner--${this.size}`;
  }
}

import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Componente base para manejo automático de suscripciones
 * Implementa el patrón de destrucción automática
 */
@Directive()
export abstract class BaseComponent implements OnDestroy {
  protected readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

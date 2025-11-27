import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';

/**
 * Servicio base abstracto para operaciones HTTP
 * Implementa el principio DRY y proporciona métodos reutilizables
 */
export abstract class BaseHttpService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = environment.apiUrl;

  /**
   * Obtiene los headers por defecto
   */
  protected getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  /**
   * Maneja errores HTTP
   */
  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }

    console.error('Error en petición HTTP:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Realiza una petición GET
   */
  protected get<T>(endpoint: string): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Realiza una petición POST
   */
  protected post<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Realiza una petición PUT
   */
  protected put<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Realiza una petición DELETE
   */
  protected delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }
}

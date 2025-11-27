import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseHttpService } from '@core/services/base-http.service';
import { Product, ProductFormData } from '../models/product.interface';

/**
 * Servicio para gestión de productos financieros
 * Extiende BaseHttpService para reutilizar funcionalidad HTTP
 * Implementa SRP: solo maneja operaciones de productos
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseHttpService {
  private readonly endpoint = 'products';

  /**
   * Obtiene todos los productos financieros
   */
  getProducts(): Observable<Product[]> {
    return this.get<{ data: Product[] }>(this.endpoint).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Obtiene un producto por ID
   */
  getProductById(id: string): Observable<Product> {
    return this.get<Product>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea un nuevo producto
   */
  createProduct(product: ProductFormData): Observable<Product> {
    return this.post<Product>(this.endpoint, product);
  }

  /**
   * Actualiza un producto existente
   */
  updateProduct(id: string, product: ProductFormData): Observable<Product> {
    return this.put<Product>(`${this.endpoint}/${id}`, product);
  }

  /**
   * Elimina un producto
   */
  deleteProduct(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Verifica si un ID de producto ya existe
   */
  verifyProductId(id: string): Observable<boolean> {
    return this.get<boolean>(`${this.endpoint}/verification/${id}`);
  }
}

import { BaseEntity } from '@core/interfaces/base.interface';

/**
 * Interface para Producto Financiero
 */
export interface Product extends BaseEntity {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

/**
 * Interface para respuesta de la API de productos
 */
export interface ProductsResponse {
  data: Product[];
}

/**
 * Interface para crear/actualizar producto
 */
export interface ProductFormData {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

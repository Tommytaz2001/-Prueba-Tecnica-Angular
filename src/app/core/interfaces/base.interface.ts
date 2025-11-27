/**
 * Interface base para entidades con ID
 */
export interface BaseEntity {
  id: number | string;
}

/**
 * Interface para respuestas de API
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Interface para errores de API
 */
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/**
 * Interface para paginación
 */
export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Interface para respuestas paginadas
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

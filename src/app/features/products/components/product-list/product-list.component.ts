import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/models/base-component.model';
import { NotificationService } from '@core/services/notification.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';

/**
 * Componente para listar productos financieros
 * Implementa SRP: solo se encarga de mostrar la lista de productos
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, ConfirmationModalComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent extends BaseComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  searchTerm = '';
  itemsPerPage = 5;
  currentPage = 1;
  
  // Modal de confirmación
  showDeleteModal = false;
  productToDelete: Product | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Carga los productos desde la API
   */
  loadProducts(): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.filteredProducts = products;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.notificationService.error('Error al cargar los productos: ' + error.message);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  /**
   * Filtra productos por término de búsqueda
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
      this.currentPage = 1;
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.id.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  /**
   * Obtiene los productos de la página actual
   */
  getPaginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  /**
   * Obtiene el número total de páginas
   */
  getTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  /**
   * Cambia el número de items por página
   */
  onItemsPerPageChange(): void {
    this.currentPage = 1;
  }

  /**
   * Navega a la página anterior
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Navega a la página siguiente
   */
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  /**
   * Abre el modal de confirmación para eliminar un producto
   */
  deleteProduct(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  /**
   * Confirma la eliminación del producto
   */
  confirmDelete(): void {
    if (!this.productToDelete) return;

    this.productService
      .deleteProduct(this.productToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Producto eliminado exitosamente');
          this.showDeleteModal = false;
          this.productToDelete = null;
          this.loadProducts();
        },
        error: (error) => {
          this.notificationService.error('Error al eliminar el producto: ' + error.message);
          this.showDeleteModal = false;
          this.productToDelete = null;
        },
      });
  }

  /**
   * Cancela la eliminación del producto
   */
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * TrackBy function para optimizar el rendering de la lista
   */
  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  /**
   * Navega al formulario de creación de producto
   */
  navigateToForm(): void {
    this.router.navigate(['/products/new']);
  }

  /**
   * Navega al formulario de edición de producto
   */
  editProduct(product: Product): void {
    this.router.navigate(['/products/edit', product.id]);
  }
}

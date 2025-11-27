import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '@core/services/notification.service';
import { Product } from '../../models/product.interface';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jest.Mocked<ProductService>;
  let notificationService: jest.Mocked<NotificationService>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Producto 1',
      description: 'Descripción 1',
      logo: 'logo1.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    },
    {
      id: '2',
      name: 'Producto 2',
      description: 'Descripción 2',
      logo: 'logo2.png',
      date_release: '2025-02-01',
      date_revision: '2026-02-01',
    },
  ];

  beforeEach(async () => {
    const productServiceMock = {
      getProducts: jest.fn(),
      deleteProduct: jest.fn(),
    };

    const notificationServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load products on init', () => {
      productService.getProducts.mockReturnValue(of(mockProducts));

      component.ngOnInit();

      expect(productService.getProducts).toHaveBeenCalled();
      expect(component.products).toEqual(mockProducts);
      expect(component.filteredProducts).toEqual(mockProducts);
      expect(component.isLoading).toBe(false);
    });

    it('should handle error when loading products', () => {
      const error = new Error('Error al cargar');
      productService.getProducts.mockReturnValue(throwError(() => error));

      component.ngOnInit();

      expect(notificationService.error).toHaveBeenCalledWith(
        'Error al cargar los productos: Error al cargar'
      );
      expect(component.isLoading).toBe(false);
    });
  });

  describe('onSearch', () => {
    beforeEach(() => {
      component.products = mockProducts;
      component.filteredProducts = mockProducts;
    });

    it('should filter products by name', () => {
      component.searchTerm = 'Producto 1';
      component.onSearch();

      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].name).toBe('Producto 1');
    });

    it('should filter products by description', () => {
      component.searchTerm = 'Descripción 2';
      component.onSearch();

      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].description).toBe('Descripción 2');
    });

    it('should show all products when search term is empty', () => {
      component.searchTerm = '';
      component.onSearch();

      expect(component.filteredProducts).toEqual(mockProducts);
    });

    it('should reset to page 1 when searching', () => {
      component.currentPage = 2;
      component.searchTerm = 'test';
      component.onSearch();

      expect(component.currentPage).toBe(1);
    });
  });

  describe('getPaginatedProducts', () => {
    beforeEach(() => {
      component.filteredProducts = mockProducts;
      component.itemsPerPage = 1;
    });

    it('should return products for current page', () => {
      component.currentPage = 1;
      const result = component.getPaginatedProducts();

      expect(result.length).toBe(1);
      expect(result[0]).toEqual(mockProducts[0]);
    });

    it('should return correct products for page 2', () => {
      component.currentPage = 2;
      const result = component.getPaginatedProducts();

      expect(result.length).toBe(1);
      expect(result[0]).toEqual(mockProducts[1]);
    });
  });

  describe('getTotalPages', () => {
    it('should calculate total pages correctly', () => {
      component.filteredProducts = mockProducts;
      component.itemsPerPage = 1;

      expect(component.getTotalPages()).toBe(2);
    });

    it('should return 1 page when items per page is greater than total', () => {
      component.filteredProducts = mockProducts;
      component.itemsPerPage = 10;

      expect(component.getTotalPages()).toBe(1);
    });
  });

  describe('onItemsPerPageChange', () => {
    it('should reset to page 1 when changing items per page', () => {
      component.currentPage = 3;
      component.onItemsPerPageChange();

      expect(component.currentPage).toBe(1);
    });
  });

  describe('previousPage', () => {
    it('should go to previous page', () => {
      component.currentPage = 2;
      component.previousPage();

      expect(component.currentPage).toBe(1);
    });

    it('should not go below page 1', () => {
      component.currentPage = 1;
      component.previousPage();

      expect(component.currentPage).toBe(1);
    });
  });

  describe('nextPage', () => {
    beforeEach(() => {
      component.filteredProducts = mockProducts;
      component.itemsPerPage = 1;
    });

    it('should go to next page', () => {
      component.currentPage = 1;
      component.nextPage();

      expect(component.currentPage).toBe(2);
    });

    it('should not exceed total pages', () => {
      component.currentPage = 2;
      component.nextPage();

      expect(component.currentPage).toBe(2);
    });
  });

  describe('deleteProduct', () => {
    beforeEach(() => {
      global.confirm = jest.fn();
    });

    it('should delete product when confirmed', () => {
      (global.confirm as jest.Mock).mockReturnValue(true);
      productService.deleteProduct.mockReturnValue(of(undefined));
      productService.getProducts.mockReturnValue(of(mockProducts));

      component.deleteProduct(mockProducts[0]);

      expect(productService.deleteProduct).toHaveBeenCalledWith('1');
      expect(notificationService.success).toHaveBeenCalledWith('Producto eliminado exitosamente');
    });

    it('should not delete product when cancelled', () => {
      (global.confirm as jest.Mock).mockReturnValue(false);

      component.deleteProduct(mockProducts[0]);

      expect(productService.deleteProduct).not.toHaveBeenCalled();
    });

    it('should handle error when deleting product', () => {
      (global.confirm as jest.Mock).mockReturnValue(true);
      const error = new Error('Error al eliminar');
      productService.deleteProduct.mockReturnValue(throwError(() => error));

      component.deleteProduct(mockProducts[0]);

      expect(notificationService.error).toHaveBeenCalledWith(
        'Error al eliminar el producto: Error al eliminar'
      );
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const result = component.formatDate('2025-01-15');

      expect(result).toBe('15/01/2025');
    });

    it('should handle different date formats', () => {
      const result = component.formatDate('2025-12-31');

      expect(result).toBe('31/12/2025');
    });
  });
});

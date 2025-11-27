import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product, ProductFormData } from '../models/product.interface';
import { environment } from '@environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/products`;

  const mockProduct: Product = {
    id: 'test-1',
    name: 'Producto Test',
    description: 'Descripción test',
    logo: 'test-logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
  };

  const mockProducts: Product[] = [mockProduct];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return an array of products', (done) => {
      service.getProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockProducts });
    });

    it('should handle error when getting products', (done) => {
      const errorMessage = 'Error al cargar productos';

      service.getProducts().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getProductById', () => {
    it('should return a single product', (done) => {
      const productId = 'test-1';

      service.getProductById(productId).subscribe((product) => {
        expect(product).toEqual(mockProduct);
        expect(product.id).toBe(productId);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', (done) => {
      const newProduct: ProductFormData = {
        id: 'new-1',
        name: 'Nuevo Producto',
        description: 'Nueva descripción',
        logo: 'new-logo.png',
        date_release: '2025-02-01',
        date_revision: '2026-02-01',
      };

      service.createProduct(newProduct).subscribe((product) => {
        expect(product).toBeTruthy();
        expect(product.name).toBe(newProduct.name);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush({ ...newProduct });
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', (done) => {
      const productId = 'test-1';
      const updatedData: ProductFormData = {
        ...mockProduct,
        name: 'Producto Actualizado',
      };

      service.updateProduct(productId, updatedData).subscribe((product) => {
        expect(product).toBeTruthy();
        expect(product.name).toBe(updatedData.name);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedData);
      req.flush({ ...updatedData });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', (done) => {
      const productId = 'test-1';

      service.deleteProduct(productId).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('verifyProductId', () => {
    it('should verify if product ID exists', (done) => {
      const productId = 'test-1';

      service.verifyProductId(productId).subscribe((exists) => {
        expect(exists).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/verification/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should return false if product ID does not exist', (done) => {
      const productId = 'non-existent';

      service.verifyProductId(productId).subscribe((exists) => {
        expect(exists).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/verification/${productId}`);
      req.flush(false);
    });
  });
});

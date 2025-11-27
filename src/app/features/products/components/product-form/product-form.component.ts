import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/models/base-component.model';
import { NotificationService } from '@core/services/notification.service';
import { ProductService } from '../../services/product.service';
import { ProductFormData } from '../../models/product.interface';

/**
 * Componente para crear/editar productos financieros
 * Implementa SRP: solo se encarga del formulario de productos
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent extends BaseComponent implements OnInit {
  productForm!: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.checkEditMode();
    this.initializeForm();
    
    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  /**
   * Verifica si está en modo edición
   */
  private checkEditMode(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;
  }

  /**
   * Inicializa el formulario con validaciones
   */
  private initializeForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.productForm = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required]],
      date_revision: [{ value: '', disabled: true }],
    });

    // Calcular fecha de revisión automáticamente
    this.productForm.get('date_release')?.valueChanges.subscribe((releaseDate) => {
      if (releaseDate) {
        const revisionDate = this.calculateRevisionDate(releaseDate);
        this.productForm.patchValue({ date_revision: revisionDate }, { emitEvent: false });
      }
    });
  }

  /**
   * Calcula la fecha de revisión (1 año después de la fecha de liberación)
   */
  private calculateRevisionDate(releaseDate: string): string {
    const date = new Date(releaseDate);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  }

  /**
   * Valida si un campo tiene errores y ha sido tocado
   */
  hasError(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido!';
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (field.errors['maxlength']) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    if (field.errors['idExists']) return 'ID no válido!';

    return '';
  }

  /**
   * Carga los datos del producto en modo edición
   */
  private loadProduct(id: string): void {
    this.productService
      .getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product) => {
          this.productForm.patchValue({
            id: product.id,
            name: product.name,
            description: product.description,
            logo: product.logo,
            date_release: product.date_release,
            date_revision: product.date_revision,
          });

          // Deshabilitar el campo ID en modo edición
          this.productForm.get('id')?.disable();
        },
        error: (error) => {
          this.notificationService.error('Error al cargar el producto: ' + error.message);
          this.router.navigate(['/']);
        },
      });
  }

  /**
   * Valida el ID contra el servicio de verificación
   */
  async validateId(): Promise<void> {
    // No validar en modo edición
    if (this.isEditMode) return;

    const idControl = this.productForm.get('id');
    if (!idControl || !idControl.value) return;

    const id = idControl.value.trim();
    if (id.length < 3 || id.length > 10) return;

    try {
      const exists = await this.productService
        .verifyProductId(id)
        .pipe(takeUntil(this.destroy$))
        .toPromise();

      if (exists) {
        idControl.setErrors({ idExists: true });
      }
    } catch (error) {
      console.error('Error validando ID:', error);
    }
  }

  /**
   * Envía el formulario
   */
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      this.notificationService.error('Por favor complete todos los campos correctamente');
      return;
    }

    this.isSubmitting = true;

    // Habilitar temporalmente campos deshabilitados para obtener sus valores
    this.productForm.get('date_revision')?.enable();
    const idControl = this.productForm.get('id');
    const wasIdDisabled = idControl?.disabled;
    if (wasIdDisabled) {
      idControl?.enable();
    }

    const formData: ProductFormData = this.productForm.value;

    // Restaurar estado de campos
    this.productForm.get('date_revision')?.disable();
    if (wasIdDisabled) {
      idControl?.disable();
    }

    if (this.isEditMode && this.productId) {
      // Modo edición
      this.productService
        .updateProduct(this.productId, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success('Producto actualizado exitosamente');
            this.isSubmitting = false;
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.notificationService.error('Error al actualizar el producto: ' + error.message);
            this.isSubmitting = false;
          },
        });
    } else {
      // Modo creación
      this.productService
        .createProduct(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success('Producto creado exitosamente');
            this.isSubmitting = false;
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.notificationService.error('Error al crear el producto: ' + error.message);
            this.isSubmitting = false;
          },
        });
    }
  }

  /**
   * Reinicia el formulario
   */
  onReset(): void {
    this.productForm.reset();
    this.productForm.markAsUntouched();
    this.productForm.markAsPristine();
  }

  /**
   * Marca todos los campos del formulario como tocados
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}

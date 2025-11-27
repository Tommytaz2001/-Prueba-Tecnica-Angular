# CRUD Angular - Gestión de Productos Financieros

Aplicación web para la gestión de productos financieros desarrollada con Angular 21, siguiendo las mejores prácticas de desarrollo, Clean Code y principios SOLID.

## 🎯 Características Principales

### Funcionalidades Implementadas

- ✅ **Listado de Productos**: Visualización de productos financieros con paginación
- ✅ **Búsqueda en Tiempo Real**: Filtrado por ID, nombre y descripción
- ✅ **Crear Producto**: Formulario con validaciones completas
- ✅ **Editar Producto**: Actualización de productos existentes
- ✅ **Eliminar Producto**: Confirmación mediante modal personalizado
- ✅ **Validaciones**: ID único, fechas, longitudes de campos
- ✅ **Notificaciones**: Sistema de feedback visual para el usuario
- ✅ **Responsive Design**: Adaptado para dispositivos móviles y desktop

### Stack Tecnológico

- **Angular 21** (superior a la versión 14 requerida)
- **TypeScript 5.9.2** (superior a la versión 4.8 requerida)
- **Jest** para pruebas unitarias (configurado para 70% coverage)
- **RxJS** para programación reactiva
- **CSS Puro** sin frameworks de estilos
- **Componentes Standalone** de Angular
- **Reactive Forms** para manejo de formularios

## Inicio Rápido

### Prerrequisitos

- Node.js 22.18.0 o superior
- npm 10.9.3 o superior
- Angular CLI 21.0.1 o superior

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

### Backend API

La aplicación consume una API REST que debe estar ejecutándose en `http://localhost:3002/bp/products`

**Endpoints utilizados:**
- `GET /bp/products` - Obtener todos los productos
- `GET /bp/products/:id` - Obtener un producto por ID
- `POST /bp/products` - Crear un nuevo producto
- `PUT /bp/products/:id` - Actualizar un producto
- `DELETE /bp/products/:id` - Eliminar un producto
- `GET /bp/products/verification/:id` - Verificar si un ID existe

**Nota**: Asegúrate de que el backend esté corriendo antes de iniciar la aplicación frontend.

## 📁 Estructura del Proyecto

```bash
src/
├── app/
│   ├── core/                           # Servicios singleton y modelos base
│   │   ├── interfaces/                 # Interfaces globales
│   │   │   └── notification.interface.ts
│   │   ├── models/                     # Modelos base
│   │   │   └── base-component.model.ts
│   │   └── services/                   # Servicios core
│   │       ├── base-http.service.ts    # Servicio HTTP base
│   │       └── notification.service.ts # Sistema de notificaciones
│   │
│   ├── shared/                         # Componentes reutilizables
│   │   └── components/
│   │       ├── confirmation-modal/     # Modal de confirmación
│   │       ├── loading/                # Indicador de carga
│   │       └── notification/           # Componente de notificaciones
│   │
│   ├── features/                       # Funcionalidades de la aplicación
│   │   └── products/                   # Módulo de productos
│   │       ├── components/
│   │       │   ├── product-list/       # Lista y búsqueda de productos
│   │       │   └── product-form/       # Formulario crear/editar
│   │       ├── models/
│   │       │   └── product.interface.ts
│   │       └── services/
│   │           └── product.service.ts  # Servicio de productos
│   │
│   ├── app.ts                          # Componente raíz
│   ├── app.config.ts                   # Configuración de la aplicación
│   └── app.routes.ts                   # Configuración de rutas
│
└── environments/                       # Configuraciones de entorno
    └── environment.ts
```

## Testing

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Coverage Mínimo

El proyecto está configurado con un **coverage mínimo del 70%** en:
- Branches
- Functions
- Lines
- Statements

## Calidad de Código

### Linting

```bash
# Verificar código
npm run lint

# Corregir problemas automáticamente
npm run lint:fix
```

### Formateo

```bash
# Formatear código
npm run format

# Verificar formato
npm run format:check
```

## Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada componente y servicio tiene una única responsabilidad
- Separación clara entre lógica de negocio y presentación

### Open/Closed Principle (OCP)
- Uso de interfaces y abstracciones
- Extensibilidad mediante herencia

### Liskov Substitution Principle (LSP)
- Implementaciones intercambiables
- Uso correcto de polimorfismo

### Interface Segregation Principle (ISP)
- Interfaces específicas y pequeñas
- No se fuerza implementación de métodos innecesarios

### Dependency Inversion Principle (DIP)
- Dependencia de abstracciones (interfaces)
- Inyección de dependencias

## Clean Code

- Nombres descriptivos y significativos
- Funciones pequeñas (máx 50 líneas)
- Complejidad ciclomática limitada (máx 10)
- Sin código duplicado
- Comentarios solo cuando aportan valor

## Scripts Disponibles

```bash
npm start              # Servidor de desarrollo
npm run build          # Build de producción
npm run watch          # Build en modo watch
npm test               # Ejecutar pruebas
npm run test:watch     # Pruebas en modo watch
npm run test:coverage  # Generar reporte de cobertura
npm run lint           # Verificar código
npm run lint:fix       # Corregir código automáticamente
npm run format         # Formatear código
npm run format:check   # Verificar formato
```

## Configuración

### Entornos

- `environment.ts` - Desarrollo
- `environment.prod.ts` - Producción

### TypeScript

- Modo estricto habilitado
- Path mappings configurados (@app, @core, @shared, @features, @environments)

### Jest

- Preset para Angular
- Coverage threshold: 70%
- Mocks configurados

### ESLint

- Reglas estrictas de TypeScript
- Reglas de accesibilidad
- Límites de complejidad

## 🧩 Componentes y Servicios

### Componentes Principales

#### ProductListComponent
- Listado de productos con paginación (5 items por página)
- Búsqueda en tiempo real por ID, nombre y descripción
- Menú contextual con opciones de editar y eliminar
- Navegación a formulario de creación

#### ProductFormComponent
- Formulario reactivo con validaciones
- Modo dual: Crear y Editar
- Validación de ID único contra el servidor
- Cálculo automático de fecha de revisión (+1 año)
- Campo ID deshabilitado en modo edición

#### ConfirmationModalComponent
- Modal personalizado para confirmaciones
- Diseño con CSS puro
- Cierre al hacer click fuera del modal
- Animaciones suaves

#### NotificationComponent
- Sistema de notificaciones con 4 tipos: Success, Error, Warning, Info
- Auto-desaparece después de 5 segundos
- Múltiples notificaciones simultáneas

#### LoadingComponent
- Indicador de carga personalizado
- Múltiples tamaños disponibles

### Servicios Core

#### ProductService
- CRUD completo de productos
- Verificación de ID único
- Manejo de errores centralizado
- Integración con API REST

#### NotificationService
- Manejo reactivo de notificaciones
- Observable para suscripción de componentes
- Auto-eliminación de notificaciones

#### BaseHttpService
- Servicio base para peticiones HTTP
- Métodos GET, POST, PUT, DELETE
- Manejo centralizado de errores
- Configuración de API URL desde environment

## ✅ Validaciones del Formulario

### Campo ID
- Requerido
- Mínimo 3 caracteres
- Máximo 10 caracteres
- Debe ser único (validación asíncrona contra el servidor)
- Deshabilitado en modo edición

### Campo Nombre
- Requerido
- Mínimo 5 caracteres
- Máximo 100 caracteres

### Campo Descripción
- Requerido
- Mínimo 10 caracteres
- Máximo 200 caracteres

### Campo Logo
- Requerido
- Debe ser una URL válida

### Campo Fecha de Liberación
- Requerido
- Debe ser una fecha válida
- Debe ser igual o mayor a la fecha actual

### Campo Fecha de Revisión
- Calculado automáticamente (+1 año de la fecha de liberación)
- Solo lectura

## 🎨 Diseño y Estilos

- **CSS Puro**: Sin frameworks de estilos (Bootstrap, Material, etc.)
- **Responsive**: Adaptado para móviles, tablets y desktop
- **Colores corporativos**: Amarillo (#FFD500) como color principal
- **Animaciones**: Transiciones suaves en botones y modales
- **Accesibilidad**: Contraste adecuado y navegación por teclado

## 🏗️ Buenas Prácticas Implementadas

### Arquitectura
1. Componentes standalone de Angular
2. Separación clara de responsabilidades (SRP)
3. Inyección de dependencias
4. Uso de interfaces y tipos de TypeScript

### Código
1. Implementar OnDestroy para limpieza de suscripciones
2. Uso de takeUntil para evitar memory leaks
3. Manejo centralizado de errores
4. Nombres descriptivos y significativos
5. Funciones pequeñas y enfocadas
6. Comentarios solo cuando aportan valor

### Testing
1. Pruebas unitarias con Jest
2. Mocks de servicios HTTP
3. Coverage mínimo del 70%
4. Tests de componentes y servicios

## Notas

- No se utilizan frameworks de estilos (Bootstrap, Material, etc.)
- Todos los estilos son CSS puro personalizado
- Los servicios necesarios son locales
- El proyecto sigue las guías de estilo oficiales de Angular

## Licencia

Este proyecto es parte de un ejercicio técnico.

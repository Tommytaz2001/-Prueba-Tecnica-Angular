# Estructura del Proyecto - CRUD Angular

## 📁 Arquitectura del Proyecto

Este proyecto sigue los principios de **Clean Architecture** y **SOLID** para garantizar un código mantenible, escalable y testeable.

```
src/
├── app/
│   ├── core/                    # Módulo Core (Singleton)
│   │   ├── guards/              # Guards de navegación
│   │   ├── interceptors/        # HTTP Interceptors
│   │   ├── interfaces/          # Interfaces globales
│   │   ├── models/              # Modelos de dominio
│   │   └── services/            # Servicios singleton (API, Auth, etc.)
│   │
│   ├── shared/                  # Módulo Shared (Reutilizable)
│   │   ├── components/          # Componentes compartidos
│   │   ├── directives/          # Directivas personalizadas
│   │   ├── pipes/               # Pipes personalizados
│   │   └── utils/               # Utilidades y helpers
│   │
│   ├── features/                # Módulos de características
│   │   └── [feature-name]/      # Cada feature es independiente
│   │       ├── components/      # Componentes de la feature
│   │       ├── services/        # Servicios específicos de la feature
│   │       ├── models/          # Modelos específicos de la feature
│   │       └── [feature].routes.ts
│   │
│   ├── app.ts                   # Componente raíz
│   ├── app.config.ts            # Configuración de la aplicación
│   └── app.routes.ts            # Rutas principales
│
└── environments/                # Configuraciones de entorno
    ├── environment.ts           # Desarrollo
    └── environment.prod.ts      # Producción
```

## 🎯 Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada clase/componente tiene una única responsabilidad
- Los servicios están separados por dominio
- Los componentes solo manejan la lógica de presentación

### Open/Closed Principle (OCP)
- Uso de interfaces para abstracciones
- Extensibilidad mediante herencia e implementación
- Guards e Interceptors como puntos de extensión

### Liskov Substitution Principle (LSP)
- Las implementaciones pueden sustituir a sus abstracciones
- Uso correcto de herencia y polimorfismo

### Interface Segregation Principle (ISP)
- Interfaces específicas y pequeñas
- No se fuerza a implementar métodos innecesarios

### Dependency Inversion Principle (DIP)
- Dependencia de abstracciones (interfaces)
- Inyección de dependencias de Angular
- Servicios desacoplados

## 🧪 Testing

- **Framework**: Jest
- **Coverage mínimo**: 70%
- **Ubicación de tests**: Junto a cada archivo (*.spec.ts)

### Comandos de Testing
```bash
npm test              # Ejecutar tests
npm run test:watch    # Modo watch
npm run test:coverage # Generar reporte de cobertura
```

## 🎨 Estilos y Código Limpio

### Sin Frameworks de UI
- CSS puro personalizado
- No se usan frameworks como Bootstrap, Material, etc.
- Componentes diseñados desde cero

### Herramientas de Calidad
- **ESLint**: Análisis estático de código
- **Prettier**: Formateo automático
- **TypeScript Strict**: Modo estricto habilitado

### Comandos de Linting
```bash
npm run lint          # Verificar código
npm run lint:fix      # Corregir automáticamente
npm run format        # Formatear código
npm run format:check  # Verificar formato
```

## 🚀 Comandos Disponibles

```bash
npm start             # Iniciar servidor de desarrollo
npm run build         # Build de producción
npm run watch         # Build en modo watch
npm test              # Ejecutar tests
npm run lint          # Verificar código
```

## 📋 Requisitos

- **Angular**: 21.0.0 (>= 14)
- **TypeScript**: 5.9.2 (>= 4.8)
- **Node.js**: 22.18.0
- **npm**: 10.9.3

## 🔧 Configuración

### TypeScript
- Modo estricto habilitado
- Configuración optimizada para Angular

### Jest
- Preset para Angular
- Coverage threshold: 70%
- Mocks configurados para localStorage y sessionStorage

### ESLint
- Reglas estrictas de TypeScript
- Reglas de accesibilidad para templates
- Límites de complejidad y longitud de funciones

## 📝 Buenas Prácticas

1. **Componentes**
   - Usar OnPush change detection cuando sea posible
   - Implementar OnDestroy para limpieza de suscripciones
   - Mantener componentes pequeños y enfocados

2. **Servicios**
   - Usar RxJS para manejo de estado asíncrono
   - Implementar manejo de errores robusto
   - Documentar métodos públicos

3. **Testing**
   - Escribir tests antes de implementar (TDD)
   - Cubrir casos edge
   - Usar mocks apropiadamente

4. **Código Limpio**
   - Nombres descriptivos
   - Funciones pequeñas (máx 50 líneas)
   - Evitar código duplicado
   - Comentarios solo cuando sea necesario

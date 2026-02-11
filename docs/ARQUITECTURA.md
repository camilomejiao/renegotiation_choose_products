# Arquitectura del Proyecto

## 1) Resumen
Este proyecto es una SPA (Single Page Application) construida en React 18 con enrutamiento client‘side, separación por módulos funcionales y un set de servicios para comunicación con el backend. La UI combina React‘Bootstrap, MUI (DataGrid), React‘Select y un sistema de estilos globales en `src/styles/index.css`.

## Diagrama (alto nivel)
Diagrama exportado en imagen:

- `docs/arquitectura-diagrama.svg`

## 2) Stack técnico
- **Framework UI:** React 18 (`react`, `react-dom`, `react-scripts`)
- **Enrutamiento:** `react-router-dom`
- **UI & estilos:** `react-bootstrap`, `bootstrap`, `@mui/material`, `@mui/x-data-grid`, `react-select`, `react-icons`
- **Forms & validación:** `formik`, `yup`
- **Utilidades:** `date-fns`, `lodash.debounce`, `jwt-decode`, `xlsx`, `print-js`, `sweetalert2`

## 3) Estructura de carpetas (alto nivel)
```
src/
  assets/                 # imágenes e íconos
  components/
    layout/
      public/             # layout y pantallas públicas (login, registro)
      private/            # módulos privados por dominio funcional
      shared/             # componentes reutilizables (headers, modales, etc.)
    ...                   # componentes auxiliares
  context/                # contexto global (AuthProvider)
  guards/                 # guards de rutas (ej. SupplierDocsGuard)
  helpers/
    alert/                # wrapper de alertas (SweetAlert2)
    services/             # servicios de API por módulo
    utils/                # utilidades compartidas
  hooks/                  # hooks personalizados
  router/                 # routing y enums de rutas
  styles/                 # estilos globales (index.css)
```

## 4) Enrutamiento y layouts
El enrutamiento principal está en `src/router/Routing.jsx`:
- **PublicLayout**: login/registro
- **PrivateLayout**: módulos privados (dashboard, pagos, entregas, productos, etc.)
- **Guards**: por ejemplo `SupplierDocsGuard` para proteger rutas

Las rutas se centralizan en `src/router/RouterEnum.jsx` y se consumen desde `Routing.jsx`.

## 5) Organización por módulos (private)
Los módulos privados están organizados por dominio:
- **Beneficiaries**: `beneficiaries_management_module`
- **Deliveries**: `deliveries_module`
- **Payments**: `payments_module`
- **Products**: `products_module`
- **Purchase Orders**: `purchase_orders_module`
- **Renegotiation**: `renegociation_module`
- **Reports / Management**: `reports_module`, `management_module`

Cada módulo suele tener:
- Pantallas (views)
- Subcomponentes
- Lógica de búsqueda/tabla
- Estilos globales en `src/styles/index.css`

## 6) Servicios (API)
La comunicación con el backend se concentra en `src/helpers/services/`.
Cada servicio representa un dominio funcional (ej. `PaymentServices.jsx`, `DeliveriesServices.jsx`, `UserServices.jsx`, etc.).

Ventajas:
- Aislamiento de endpoints
- Reutilización en diferentes pantallas
- Facilitación de mantenimiento

## 7) Estado y flujos de datos
- **Estado local** en componentes (React `useState`)
- **Estado global**: `AuthProvider` en `src/context`
- **Forms**: `Formik` + `Yup`
- **Tablas**: `MUI DataGrid` con paginación server‘side cuando aplica

## 8) UI/UX y estilos
El styling sigue un enfoque híbrido:
- **Global**: `src/styles/index.css`
- **Frameworks**: `react-bootstrap` + `MUI`
- **Componentes shared** para estandarizar UI (por ejemplo `SectionHeader`)

Convención actual:
- Encabezados de secciones con `SectionHeader`
- Tablas con header `#2d3a4d`
- Botones con estilos consistentes (acción primaria, secundaria, ghost)

## 9) Componentes compartidos clave
Ubicados en `src/components/layout/shared/`:
- `HeaderImage` (banners superiores)
- `UserInformation` (card de usuario)
- `Loading` (loader global)
- `Modals` (aprobación, confirmación, etc.)
- `SectionHeader` (título + ícono + subtítulo + línea)

## 10) Archivos importantes de configuración
- `package.json` (dependencias y scripts)
- `src/styles/index.css` (estilos globales)
- `src/router/Routing.jsx` (rutas principales)

## 11) Build y ejecución
Scripts estándar:
```
npm start
npm build
npm test
```

Proxy configurado en `package.json`:
```
"proxy": "https://devproveedorespnis.direccionsustitucion-pnis.gov.co"
```

## 12) Guía de extensión
Cuando se agregue un nuevo módulo:
1. Crear carpeta en `src/components/layout/private/<modulo>`
2. Crear servicio en `src/helpers/services/`
3. Agregar rutas en `RouterEnum.jsx` y `Routing.jsx`
4. Aplicar estilos globales (o componentes shared) para consistencia visual

## 13) Convenciones de UI recomendadas
- Usar `SectionHeader` para títulos y subtítulos
- Mantener botones con clases estandarizadas
- Tablas con DataGrid y header uniforme
- Inputs y selects con bordes visibles y consistentes

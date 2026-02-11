# Arquitectura del Proyecto

## 1) Resumen
Este proyecto es una SPA (Single Page Application) construida en React 18 con enrutamiento client‑side, separaci�n por m�dulos funcionales y un set de servicios para comunicaci�n con el backend. La UI combina React‑Bootstrap, MUI (DataGrid), React‑Select y un sistema de estilos globales en `src/styles/index.css`.

## Diagrama (alto nivel)
Diagrama exportado en imagen:

- `docs/arquitectura-diagrama.svg`

## 2) Stack t�cnico
- **Framework UI:** React 18 (`react`, `react-dom`, `react-scripts`)
- **Enrutamiento:** `react-router-dom`
- **UI & estilos:** `react-bootstrap`, `bootstrap`, `@mui/material`, `@mui/x-data-grid`, `react-select`, `react-icons`
- **Forms & validaci�n:** `formik`, `yup`
- **Utilidades:** `date-fns`, `lodash.debounce`, `jwt-decode`, `xlsx`, `print-js`, `sweetalert2`

## 3) Estructura de carpetas (alto nivel)
```
src/
  assets/                 # im�genes e �conos
  components/
    layout/
      public/             # layout y pantallas p�blicas (login, registro)
      private/            # m�dulos privados por dominio funcional
      shared/             # componentes reutilizables (headers, modales, etc.)
    ...                   # componentes auxiliares
  context/                # contexto global (AuthProvider)
  guards/                 # guards de rutas (ej. SupplierDocsGuard)
  helpers/
    alert/                # wrapper de alertas (SweetAlert2)
    services/             # servicios de API por m�dulo
    utils/                # utilidades compartidas
  hooks/                  # hooks personalizados
  router/                 # routing y enums de rutas
  styles/                 # estilos globales (index.css)
```

## 4) Enrutamiento y layouts
El enrutamiento principal est� en `src/router/Routing.jsx`:
- **PublicLayout**: login/registro
- **PrivateLayout**: m�dulos privados (dashboard, pagos, entregas, productos, etc.)
- **Guards**: por ejemplo `SupplierDocsGuard` para proteger rutas

Las rutas se centralizan en `src/router/RouterEnum.jsx` y se consumen desde `Routing.jsx`.

## 5) Organizaci�n por m�dulos (private)
Los m�dulos privados est�n organizados por dominio:
- **Beneficiaries**: `beneficiaries_management_module`
- **Deliveries**: `deliveries_module`
- **Payments**: `payments_module`
- **Products**: `products_module`
- **Purchase Orders**: `purchase_orders_module`
- **Renegotiation**: `renegociation_module`
- **Reports / Management**: `reports_module`, `management_module`

Cada m�dulo suele tener:
- Pantallas (views)
- Subcomponentes
- L�gica de b�squeda/tabla
- Estilos globales en `src/styles/index.css`

## 6) Servicios (API)
La comunicaci�n con el backend se concentra en `src/helpers/services/`.
Cada servicio representa un dominio funcional (ej. `PaymentServices.jsx`, `DeliveriesServices.jsx`, `UserServices.jsx`, etc.).

Ventajas:
- Aislamiento de endpoints
- Reutilizaci�n en diferentes pantallas
- Facilitaci�n de mantenimiento

## 7) Estado y flujos de datos
- **Estado local** en componentes (React `useState`)
- **Estado global**: `AuthProvider` en `src/context`
- **Forms**: `Formik` + `Yup`
- **Tablas**: `MUI DataGrid` con paginaci�n server‑side cuando aplica

## 8) UI/UX y estilos
El styling sigue un enfoque h�brido:
- **Global**: `src/styles/index.css`
- **Frameworks**: `react-bootstrap` + `MUI`
- **Componentes shared** para estandarizar UI (por ejemplo `SectionHeader`)

Convenci�n actual:
- Encabezados de secciones con `SectionHeader`
- Tablas con header `#2d3a4d`
- Botones con estilos consistentes (acci�n primaria, secundaria, ghost)

## 9) Componentes compartidos clave
Ubicados en `src/components/layout/shared/`:
- `HeaderImage` (banners superiores)
- `UserInformation` (card de usuario)
- `Loading` (loader global)
- `Modals` (aprobaci�n, confirmaci�n, etc.)
- `SectionHeader` (t�tulo + �cono + subt�tulo + l�nea)

## 10) Archivos importantes de configuraci�n
- `package.json` (dependencias y scripts)
- `src/styles/index.css` (estilos globales)
- `src/router/Routing.jsx` (rutas principales)

## 11) Build y ejecuci�n
Scripts est�ndar:
```
npm start
npm build
npm test
```

Proxy configurado en `package.json`:
```
"proxy": "https://devproveedorespnis.direccionsustitucion-pnis.gov.co"
```

## 12) Gu�a de extensi�n
Cuando se agregue un nuevo m�dulo:
1. Crear carpeta en `src/components/layout/private/<modulo>`
2. Crear servicio en `src/helpers/services/`
3. Agregar rutas en `RouterEnum.jsx` y `Routing.jsx`
4. Aplicar estilos globales (o componentes shared) para consistencia visual

## 13) Convenciones de UI recomendadas
- Usar `SectionHeader` para t�tulos y subt�tulos
- Mantener botones con clases estandarizadas
- Tablas con DataGrid y header uniforme
- Inputs y selects con bordes visibles y consistentes


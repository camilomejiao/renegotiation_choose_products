// Breakpoints oficiales de Ant Design (px). Se exponen helpers `down`/`up`/`between`
// para escribir media queries consistentes en styled-components.
export const BREAKPOINTS = {
  xs: 480, // < xs: móviles muy pequeños (AntD usa 480 como salto interno de Col xs)
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

// Estilos que aplican por debajo del breakpoint (max-width: bp - 0.02px).
export const down = (bp) => `@media (max-width: ${BREAKPOINTS[bp] - 0.02}px)`;

// Estilos que aplican desde el breakpoint hacia arriba (min-width: bp).
export const up = (bp) => `@media (min-width: ${BREAKPOINTS[bp]}px)`;

// Estilos que aplican dentro de un rango [min, max).
export const between = (minBp, maxBp) =>
  `@media (min-width: ${BREAKPOINTS[minBp]}px) and (max-width: ${BREAKPOINTS[maxBp] - 0.02}px)`;
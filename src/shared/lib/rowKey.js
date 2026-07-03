// Generador de keys sintéticas para filas de tablas.
//
// Regla del proyecto: los `key`/`rowKey` de los componentes NO deben provenir
// de la data del backend (ids repetidos entre filas producen keys duplicadas).
// La identidad de negocio (id_orden_detalle, id_producto, etc.) se conserva en
// campos aparte; esto es solo para el render/reconciliación de React y antd.
//
// El contador es monotónico a nivel de módulo: garantiza unicidad global entre
// distintas normalizaciones que luego se combinan en una misma tabla.
let rowKeySequence = 0;

export const nextRowKey = () => {
  rowKeySequence += 1;
  return rowKeySequence;
};
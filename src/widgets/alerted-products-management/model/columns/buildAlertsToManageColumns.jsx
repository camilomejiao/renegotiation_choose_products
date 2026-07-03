import { getAlertedProductsManagementColumns } from "../getAlertedProductsManagementColumns";

// "Alertas a Gestionar" del ítem: reusa las columnas de la tabla de gestión,
// en modo lectura (sin la columna de acciones/quitar).
export const buildAlertsToManageColumns = () =>
  getAlertedProductsManagementColumns().filter((column) => column.key !== "actions");
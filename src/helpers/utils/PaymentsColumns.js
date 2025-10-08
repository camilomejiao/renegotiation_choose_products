export const beneficiaryColumns = () => [
  { field: "id", headerName: "N° Entrega", width: 150 },
  { field: "cub_id", headerName: "CUB", width: 80 },
  { field: "name", headerName: "Beneficiario", width: "auto" }, // Ancho automático
  { field: "identification", headerName: "Identificación", width: 200 },
  { field: "supplier_name", headerName: "Proveedor", width: "auto" }, // Ancho automático
  { field: "supplier_nit", headerName: "Nit", width: 130 }, // Ancho automático para mejor distribución
];

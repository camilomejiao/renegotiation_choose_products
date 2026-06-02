const normalizeAlertedProductContractRow = (row = {}) => ({
  id: String(row?.id_producto ?? ""),
  supplier: row?.proveedor ?? "",
  productId: String(row?.id_producto ?? ""),
  productName: row?.nombre_producto ?? "",
  unitOfMeasure: row?.unidad_medida ?? "",
  commercialBrand: row?.marca_comercial ?? "",
  minimumPrice: Number(row?.precio_minimo ?? 0),
  maximumPrice: Number(row?.precio_maximo ?? 0),
  saleUnitValue: Number(row?.valor_unitario_venta ?? 0),
  fairCatalogValue: Number(row?.valor_catalogo_feria ?? 0),
  alertCategory: row?.categoria_alerta?.nombre ?? "",
  managementType: row?.tipo_gestion?.nombre ?? "",
  alertManagement: row?.gestion_alerta?.nombre ?? "",
  alertCategoryCode: row?.categoria_alerta?.id ?? row?.categoria_alerta?.codigo ?? null,
  managementTypeCode: row?.tipo_gestion?.id ?? row?.tipo_gestion?.codigo ?? null,
  alertManagementCode: row?.gestion_alerta?.id ?? row?.gestion_alerta?.codigo ?? null,
  hasAssignedManagementType: Boolean(row?.tipo_gestion?.id ?? row?.tipo_gestion?.codigo),
});

export const alertedProductsTableResponseMock = {
  meta: {
    page: 1,
    size: 3,
    total_registros: 3,
    total_pages: 1,
  },
  productos: [
    {
      proveedor: "Cooperativa Cauca",
      id_producto: 133458,
      nombre_producto: "Fertilizante NPK 15-15-15",
      unidad_medida: "Saco x 50 kg",
      marca_comercial: "AgroForte",
      precio_minimo: 120000,
      precio_maximo: 128500,
      valor_unitario_venta: 128500,
      valor_catalogo_feria: 119800,
      categoria_alerta: {
        id: 5256,
        nombre: "POR ENCIMA PRECIO MAXIMO",
      },
      tipo_gestion: {
        id: 5275,
        nombre: "ACTA COMPLEMENTARIA",
      },
      gestion_alerta: {
        id: 5272,
        nombre: "SIN GESTIÓN",
      },
    },
    {
      proveedor: "BioCampo Ltda.",
      id_producto: 133459,
      nombre_producto: "Abono orgánico compost",
      unidad_medida: "Saco x 40 kg",
      marca_comercial: "BioCampo",
      precio_minimo: 18000,
      precio_maximo: 27000,
      valor_unitario_venta: 27000,
      valor_catalogo_feria: 25000,
      categoria_alerta: {
        id: 5255,
        nombre: "NO TIENE ESTUDIO DE MERCADO",
      },
      tipo_gestion: {
        id: 5279,
        nombre: "AJUSTE DE PRECIO",
      },
      gestion_alerta: {
        id: 5259,
        nombre: "EN PROCESO",
      },
    },
    {
      proveedor: "Agroinsumos del Sur",
      id_producto: 133460,
      nombre_producto: "Semilla de plátano hartón",
      unidad_medida: "Unidad",
      marca_comercial: "AgroSur",
      precio_minimo: 1500,
      precio_maximo: 1750,
      valor_unitario_venta: 1400,
      valor_catalogo_feria: 1600,
      categoria_alerta: {
        id: 5257,
        nombre: "POR DEBAJO PRECIO MINIMO",
      },
      tipo_gestion: {
        id: 5277,
        nombre: "JUSTIFICACION TÉCNICA",
      },
      gestion_alerta: {
        id: 5260,
        nombre: "EN SUBSANACION",
      },
    },
  ],
};

export const alertedProductsTableData = alertedProductsTableResponseMock.productos.map(
  normalizeAlertedProductContractRow
);

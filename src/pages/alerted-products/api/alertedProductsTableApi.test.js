import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { alertedProductsServices } from "../../../helpers/services/AlertedProductsServices";
import { alertedProductsTableData } from "../../../widgets/alerted-products-table/model/alertedProductsTableData";
import {
  __resetAlertedProductsTableMockStateForTests,
  assignAlertedProductsManagementType,
  buildAlertedProductsManagementTypeRequest,
  getAlertedProductsPage,
} from "./alertedProductsTableApi";

jest.mock("../../../helpers/services/AlertedProductsServices", () => ({
  alertedProductsServices: {
    getProducts: jest.fn(),
    updateProductsManagementType: jest.fn(),
  },
}));

describe("getAlertedProductsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    __resetAlertedProductsTableMockStateForTests();
  });

  it("returns mock rows when the backend responds with an error", async () => {
    alertedProductsServices.getProducts.mockResolvedValue({
      status: ResponseStatusEnum.NOT_FOUND,
    });

    const result = await getAlertedProductsPage();

    expect(result.rows).toEqual(alertedProductsTableData);
    expect(result.meta.source).toBe("mock");
  });

  it("returns mock rows when the backend responds without products", async () => {
    alertedProductsServices.getProducts.mockResolvedValue({
      status: ResponseStatusEnum.OK,
      data: {
        meta: { page: 1 },
        productos: [],
      },
    });

    const result = await getAlertedProductsPage();

    expect(result.rows).toEqual(alertedProductsTableData);
    expect(result.meta.source).toBe("mock");
  });

  it("normalizes backend rows when the service responds with data", async () => {
    alertedProductsServices.getProducts.mockResolvedValue({
      status: ResponseStatusEnum.OK,
      data: {
        meta: { page: 1, total_registros: 1 },
        productos: [
          {
            proveedor: "AgroCampo S.A.S.",
            id_producto: 133458,
            nombre_producto: "Bomba fumigadora 20L",
            unidad_medida: "Unidad",
            marca_comercial: "Guarany",
            precio_minimo: 120000,
            precio_maximo: 150000,
            valor_unitario_venta: 168000,
            valor_catalogo_feria: 168000,
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
        ],
      },
    });

    const result = await getAlertedProductsPage();

    expect(result.meta).toEqual({ page: 1, total_registros: 1 });
    expect(result.rows).toEqual([
      {
        id: "133458",
        supplier: "AgroCampo S.A.S.",
        productId: "133458",
        productName: "Bomba fumigadora 20L",
        unitOfMeasure: "Unidad",
        commercialBrand: "Guarany",
        minimumPrice: 120000,
        maximumPrice: 150000,
        saleUnitValue: 168000,
        fairCatalogValue: 168000,
        alertCategory: "POR ENCIMA PRECIO MAXIMO",
        managementType: "ACTA COMPLEMENTARIA",
        alertManagement: "SIN GESTIÓN",
        alertCategoryCode: 5256,
        managementTypeCode: 5275,
        alertManagementCode: 5272,
        hasAssignedManagementType: true,
      },
    ]);
  });

  it("builds the management type request expected by the service contract", () => {
    const request = buildAlertedProductsManagementTypeRequest({
      managementTypeId: 5275,
      selectedRows: [alertedProductsTableData[0]],
    });

    expect(request).toEqual({
      tipo_gestion_id: 5275,
      productos: [
        {
          id_producto: 133458,
          categoria_alerta: {
            codigo: 5256,
            nombre: "POR ENCIMA PRECIO MAXIMO",
          },
        },
      ],
    });
  });

  it("falls back to mock assignment and the next table load reflects the updated management type", async () => {
    alertedProductsServices.updateProductsManagementType.mockResolvedValue({
      status: ResponseStatusEnum.NOT_FOUND,
    });
    alertedProductsServices.getProducts.mockResolvedValue({
      status: ResponseStatusEnum.NOT_FOUND,
    });

    await assignAlertedProductsManagementType({
      managementTypeId: 5279,
      selectedRows: [alertedProductsTableData[0]],
    });

    const result = await getAlertedProductsPage();
    const updatedRow = result.rows.find((row) => row.productId === "133458");

    expect(updatedRow.managementType).toBe("AJUSTE DE PRECIO");
    expect(updatedRow.managementTypeCode).toBe(5279);
    expect(updatedRow.hasAssignedManagementType).toBe(true);
  });
});

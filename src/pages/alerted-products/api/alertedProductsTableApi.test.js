import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { alertedProductsServices } from "../../../helpers/services/AlertedProductsServices";
import {
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
  });

  it("throws when the backend responds with an error", async () => {
    alertedProductsServices.getProducts.mockResolvedValue({
      status: ResponseStatusEnum.NOT_FOUND,
    });

    await expect(getAlertedProductsPage()).rejects.toBeTruthy();
  });

  it("returns empty rows when the backend responds without products", async () => {
    alertedProductsServices.getProducts.mockResolvedValue({
      status: ResponseStatusEnum.OK,
      data: {
        meta: { page: 1 },
        productos: [],
      },
    });

    const result = await getAlertedProductsPage();

    expect(result.rows).toEqual([]);
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
            valor_catalogo_jornada: 168000,
            categoria_alerta: { id: 5256, nombre: "POR ENCIMA PRECIO MAXIMO" },
            tipo_gestion: { id: 5275, nombre: "ACTA COMPLEMENTARIA" },
            gestion_alerta: { id: 5272, nombre: "SIN GESTIÓN" },
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
        documentoTitular: "",
        cub: "",
        ordenNumero: "",
      },
    ]);
  });

  it("builds the management type request expected by the service contract", () => {
    const request = buildAlertedProductsManagementTypeRequest({
      managementTypeId: 5275,
      selectedRows: [
        {
          productId: "133458",
          alertCategoryCode: 5256,
          alertCategory: "POR ENCIMA PRECIO MAXIMO",
        },
      ],
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

  it("throws when assignAlertedProductsManagementType gets a backend error", async () => {
    alertedProductsServices.updateProductsManagementType.mockResolvedValue({
      status: ResponseStatusEnum.NOT_FOUND,
    });

    await expect(
      assignAlertedProductsManagementType({
        managementTypeId: 5279,
        selectedRows: [{ productId: "133458", alertCategoryCode: 5256, alertCategory: "POR ENCIMA PRECIO MAXIMO" }],
      })
    ).rejects.toBeTruthy();
  });
});
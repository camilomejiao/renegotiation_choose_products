import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { alertedProductsServices } from "../../../helpers/services/AlertedProductsServices";
import {
  assignAlertedProductsManagementType,
  buildAlertedProductsManagementTypeRequest,
  buildAlertedProductsRequestPayload,
  createAlertedProductsRequest,
  getAlertedProductsPage,
} from "./alertedProductsTableApi";

jest.mock("../../../helpers/services/AlertedProductsServices", () => ({
  alertedProductsServices: {
    getProducts: jest.fn(),
    createProductRequest: jest.fn(),
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
    const backendRow = {
      proveedor: "AgroCampo S.A.S.",
      id_producto: 133458,
      id_jornada_producto: 778899,
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
    };

    alertedProductsServices.getProducts.mockResolvedValue({
      status: ResponseStatusEnum.OK,
      data: {
        meta: { page: 1, total_registros: 1 },
        productos: [backendRow],
      },
    });

    const result = await getAlertedProductsPage();

    expect(result.meta).toEqual({ page: 1, total_registros: 1 });
    expect(result.rows).toEqual([
      {
        id: "133458",
        jornada: "",
        supplier: "AgroCampo S.A.S.",
        productId: "133458",
        journeyProductId: "778899",
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

  it("deduplicates rows when the backend returns repeated items", async () => {
    alertedProductsServices.getProducts.mockResolvedValue({
      status: ResponseStatusEnum.OK,
      data: {
        meta: { page: 1, total_registros: 2 },
        productos: [
          {
            id_orden_detalle: 9001,
            proveedor: "AgroCampo S.A.S.",
            id_producto: 133458,
            nombre_producto: "Bomba fumigadora 20L",
            categoria_alerta: { id: 5256, nombre: "POR ENCIMA PRECIO MAXIMO" },
            tipo_gestion: { id: 5275, nombre: "ACTA COMPLEMENTARIA" },
            gestion_alerta: { id: 5272, nombre: "SIN GESTIÓN" },
          },
          {
            id_orden_detalle: 9001,
            proveedor: "AgroCampo S.A.S.",
            id_producto: 133458,
            nombre_producto: "Bomba fumigadora 20L",
            categoria_alerta: { id: 5256, nombre: "POR ENCIMA PRECIO MAXIMO" },
            tipo_gestion: { id: 5275, nombre: "ACTA COMPLEMENTARIA" },
            gestion_alerta: { id: 5272, nombre: "SIN GESTIÓN" },
          },
        ],
      },
    });

    const result = await getAlertedProductsPage();

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].id).toBe("9001");
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

  it("adds valor_unitario_venta only for price adjustment without extra fields", () => {
    const request = buildAlertedProductsManagementTypeRequest({
      managementTypeId: 5274,
      selectedRows: [
        {
          productId: "133458",
          alertCategoryCode: 5254,
          alertCategory: "SIN ALERTA",
          newSalePrice: 115000,
        },
      ],
    });

    // El payload respeta el contrato: id_producto + categoria_alerta (+ valor_unitario_venta).
    expect(request).toEqual({
      tipo_gestion_id: 5274,
      productos: [
        {
          id_producto: 133458,
          categoria_alerta: { codigo: 5254, nombre: "SIN ALERTA" },
          valor_unitario_venta: 115000,
        },
      ],
    });
  });

  it("builds the solicitud payload expected by the swagger contract", () => {
    const pdf = new File(["mock"], "solicitud-alerta.pdf", {
      type: "application/pdf",
    });

    const formData = buildAlertedProductsRequestPayload({
      observation: "Soporte documental",
      pdf,
      selectedRows: [{ id: "9001" }, { id: "9002" }],
    });

    const pdfField = formData.get("pdf");
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.getAll("orden_detalle_id")).toEqual(["9001", "9002"]);
    expect(formData.get("observacion")).toBe("Soporte documental");
    expect(pdfField).toBeInstanceOf(File);
    expect(pdfField.name).toBe("solicitud-alerta.pdf");
    expect(pdfField.type).toBe("application/pdf");
  });

  it("creates the alerted products request when the backend responds with success", async () => {
    alertedProductsServices.createProductRequest.mockResolvedValue({
      status: ResponseStatusEnum.CREATED,
      data: {
        mensaje: "Solicitud creada correctamente",
      },
    });

    const result = await createAlertedProductsRequest({
      observation: "Soporte documental",
      pdf: new File(["mock"], "solicitud-alerta.pdf", {
        type: "application/pdf",
      }),
      selectedRows: [{ id: "9001" }],
    });

    expect(alertedProductsServices.createProductRequest).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ mensaje: "Solicitud creada correctamente" });
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

  it("throws when createAlertedProductsRequest gets a backend error", async () => {
    alertedProductsServices.createProductRequest.mockResolvedValue({
      status: ResponseStatusEnum.BAD_REQUEST,
    });

    await expect(
      createAlertedProductsRequest({
        observation: "Soporte documental",
        pdf: new File(["mock"], "solicitud-alerta.pdf", {
          type: "application/pdf",
        }),
        selectedRows: [{ id: "9001" }],
      })
    ).rejects.toBeTruthy();
  });
});

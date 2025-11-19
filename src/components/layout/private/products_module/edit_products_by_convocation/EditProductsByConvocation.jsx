import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaFastBackward, FaPlus, FaSave } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import StandardTable from "../../../../shared/StandardTable";

//Utils
import {
  getDeleteActionsColumns,
  getNewCatalogBaseColumns,
} from "../../../../../helpers/utils/ConvocationProductColumns";
import {
  getCategoryOptions,
  getEnvironmentalCategories,
  getUnitOptions,
} from "../../../../../helpers/utils/ValidateProductColumns";
import { handleError, showAlert } from "../../../../../helpers/utils/utils";

//Components
import productIcon from "../../../../../assets/image/addProducts/imgAdd.png";
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";
import { Breadcrumb } from "../../../../shared/Breadcrumb";
import { ModernBanner } from "../../../../shared/ModernBanner";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

//Services
import { convocationProductsServices } from "../../../../../helpers/services/ConvocationProductsServices";
import { ConfirmationModal } from "../../../shared/Modals/ConfirmationModal";

const PAGE_SIZE = 25;

export const EditProductsByConvocation = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [planRaw, setPlanRaw] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [rowCount, setRowCount] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [unitOptions, setUnitOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  /**
   *
   */
  const loadData = async () => {
    try {
      const [unitData, categoryData] = await Promise.all([
        getUnitOptions(),
        getCategoryOptions(),
      ]);

      setUnitOptions(unitData);
      setCategoryOptions(categoryData);
    } catch (error) {
      handleError(error, "Error cargando los datos iniciales.");
    }
  };

  /**
   * Carga los planes de una jornada específica (cuando se selecciona una Jornada).
   * @param {number} convocationId
   */
  const getPlans = async (convocationId) => {
    try {
      setLoading(true);
      const { data, status } =
        await convocationProductsServices.getPlansByConvocation(convocationId);
      if (status === ResponseStatusEnum.OK) {
        setPlanRaw(data?.data?.planes ?? []);
      } else {
        setPlanRaw([]);
      }
    } catch (error) {
      console.log(error);
      setPlanRaw([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedPlan = async (option) => {
    if (option?.value) {
      setSelectedPlan(option);
      await getProductList(option.value);
    }
  };

  /**
   * Obtiene los productos de un plan (para la tabla).
   * @param {number} planId
   */
  const getProductList = async (
    pageToFetch = 1,
    sizeToFetch = PAGE_SIZE,
    planId
  ) => {
    setLoading(true);
    try {
      const { data, status } =
        await convocationProductsServices.getProductByConvocationAndPlan(
          pageToFetch,
          sizeToFetch,
          planId
        );
      if (status === ResponseStatusEnum.OK) {
        const products = await normalizeRows(data?.data?.productos || []);
        setProductList(products);
        setFilteredData(products);
        setRowCount(data?.data?.total_productos);
      }
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Convierte la lista cruda de productos al formato que usa el DataGrid.
   * Incluye mapeo de campos visibles y los campos dinámicos ambientales.
   * @param {Array<object>} data
   * @returns {Promise<Array<object>>}
   */
  const normalizeRows = async (data) => {
    try {
      return data.map((row) => ({
        id: row?.id,
        name: row?.nombre,
        description: row?.especificacion_tecnicas,
        brand: row?.marca_comercial,
        unit: row?.unidad_medida?.id ?? null,
        category: row?.categoria_producto?.id ?? null,
        price_min: row?.precio_min,
        price_max: row?.precio_max,
      }));
    } catch (error) {
      console.error("Error al normalizar filas:", error);
      return [];
    }
  };

  /**
   * MUI DataGrid: procesa la actualización de una fila completa (modo "row").
   * Guarda los cambios en `editedProducts` para enviar luego.
   * @param {object} newRow
   */
  const handleRowUpdate = (newRow) => {
    setProductList((prev) =>
      prev.map((r) => (r.id === newRow.id ? newRow : r))
    );
    setFilteredData((prev) =>
      prev.map((r) => (r.id === newRow.id ? newRow : r))
    );
    return newRow;
  };

  const handleDeleteClick = async (productId) => {
    setSelectedRowId(productId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const { status } = await convocationProductsServices.deleteProduct(
        selectedRowId
      );

      if (status === ResponseStatusEnum.OK) {
        showAlert("Bien hecho!", "Producto eliminado exitosamente.");
        setShowModal(false);
        await getProductList(1, PAGE_SIZE, selectedPlan.value);
      }
    } catch (error) {
      handleError("Error", "Error al guardar los productos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModalConfirm = () => {
    setShowModal(false);
    setSelectedRowId(null);
  };

  const baseColumns = getNewCatalogBaseColumns(
    unitOptions,
    categoryOptions,
    handleRowUpdate,
    true
  );
  const accion = getDeleteActionsColumns(handleDeleteClick);
  const columns = [...baseColumns, ...accion];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = productList.filter(
      (product) =>
        (product.name || "").toLowerCase().includes(query.toLowerCase()) ||
        (product.price_max || "").toLowerCase().includes(query.toLowerCase()) ||
        (product.price_min || "").toLowerCase().includes(query.toLowerCase())
    );

    setFilteredData(filtered);
  };

  const handleCreateProducts = () => navigate("/admin/product-upload");

  const handleBack = () => navigate("/admin/list-products-by-convocation");

  const handleSaveProducts = async () => {
    try {
      setLoading(true);

      const emptyFields = productList.some((r) => {
        return !r.name || !r.price_min || !r.price_max;
      });

      if (emptyFields) {
        handleError("Revisa campos", `Tienes Algún campo vacio.`);
        setLoading(false);
        return;
      }

      const productos = await transformData(productList);

      let sendData = {
        jornada_plan: selectedPlan.value,
        productos,
      };

      const { status } =
        await convocationProductsServices.updateValidationEnvironmental(
          sendData
        );

      if (status === ResponseStatusEnum.OK) {
        showAlert("Bien hecho!", "Productos actualizados con éxito.");
        handleBack();
      }
    } catch (error) {
      handleError("Error", "Error al guardar los productos.");
    } finally {
      setLoading(false);
    }
  };

  //Obtener las claves ambientales
  const getEnvironmentalCategoryKeys = async () => {
    const categories = await getEnvironmentalCategories();
    return categories.map((category) => category.codigo);
  };

  const buildData = (_product, keys) => {
    return Object.fromEntries(keys.map((key) => [key, 1]));
  };

  //Transformar datos para ajustarlos al formato esperado por la API
  const transformData = async (inputData) => {
    const environmentalKeys = await getEnvironmentalCategoryKeys();

    return inputData.map((product) => ({
      id: product?.id,
      categoria_producto: product?.category,
      nombre: product?.name,
      unidad_medida: product?.unit,
      precio_min: Number(product?.price_min),
      precio_max: Number(product?.price_max),
      ambiental: buildData(product, environmentalKeys),
      cantidad_ambiental: {
        cant: parseInt(product?.customValue) || 0,
        ambiental_key: product?.selectedCategory || "",
      },
    }));
  };

  // Cargar datos iniciales
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
    if (params.id) {
      getPlans(params.id);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!selectedPlan?.value) return;
    getProductList(page + 1, pageSize, selectedPlan?.value);
  }, [page, pageSize, selectedPlan]);

  return (
    <>
      <Breadcrumb />
      <div className="container-fluid px-4">
        <ModernBanner
          imageHeader={imgPeople}
          titleHeader="​"
          bannerIcon={productIcon}
          bannerInformation="Editar Productos por Convocatoria"
          backgroundInformationColor="#2148C0"
          infoText="Modifica los productos de la convocatoria, ajusta precios, categorías y especificaciones técnicas."
        />

        {loading && (
          <div className="spinner-container">
            <Spinner animation="border" variant="success" />
            <span>Cargando...</span>
          </div>
        )}

        <div className="row align-items-center g-2 mb-4">
          <div className="col-12 col-md-4">
            <label className="form-label">Plan</label>
            <Select
              value={selectedPlan}
              options={planRaw.map((opt) => ({
                value: opt.id,
                label: opt.plan_nombre,
              }))}
              placeholder="Selecciona un Plan"
              onChange={handleSelectedPlan}
              isClearable
              isLoading={loading}
              classNamePrefix="custom-select"
              className="custom-select w-100"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Buscar</label>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-control"
            />
          </div>

          <div className="col-12 col-md-4 d-flex align-items-end gap-2">
            <Button variant="outline-success" onClick={handleCreateProducts}>
              <FaPlus className="me-2" />
              Crear Jornada
            </Button>

            <Button variant="outline-primary" onClick={handleBack}>
              <FaFastBackward className="me-2" />
              Volver
            </Button>
          </div>
        </div>

        <StandardTable
          columns={columns}
          rows={filteredData}
          loading={loading}
          customProps={{
            processRowUpdate: handleRowUpdate,
            editMode: "row",
            paginationMode: "server",
            rowCount: rowCount,
            paginationModel: { page, pageSize },
            onPaginationModelChange: ({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            },
            pageSizeOptions: [10, 25, 50, 100],
            getRowClassName: (params) =>
              params.row.status === "Abierto" ? "row-open" : "row-closed",
          }}
          enableDynamicHeight={true}
        />

        {/* Botón Guardar */}
        <div className="d-flex justify-content-end mt-3">
          <Button
            variant="success"
            onClick={handleSaveProducts}
            disabled={loading}
          >
            <FaSave className="me-2" />
            {loading ? "Guardando..." : "Guardar Productos"}
          </Button>
        </div>

        {/* Modal de confirmación */}
        <ConfirmationModal
          show={showModal}
          title="Confirmación de Eliminación"
          message="¿Estás seguro de que deseas eliminar este elemento?"
          onConfirm={handleConfirmDelete}
          onClose={handleCloseModalConfirm}
        />
      </div>
    </>
  );
};

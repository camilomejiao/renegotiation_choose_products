import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaBroom, FaSearch, FaTrash } from "react-icons/fa";
import StandardTable from "../../../../shared/StandardTable";

// Image
import imgDCSIPeople from "../../../../../assets/image/addProducts/imgDSCIPeople.png";
import orderIcon from "../../../../../assets/image/icons/frame.png";

// Services
import { purchaseOrderServices } from "../../../../../helpers/services/PurchaseOrderServices";

// Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Components
import { ConfirmationModal } from "../../../shared/Modals/ConfirmationModal";
import { ModernBanner } from "../../../../shared/ModernBanner";
import { Breadcrumb } from "../../../../shared/Breadcrumb";

const PAGE_SIZE = 25;

export const OrderReport = () => {
  const [purcharseOrder, setPurcharseOrder] = useState([]);
  const [rowCountState, setRowCountState] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  }); //Paginación
  const [isLoading, setIsLoading] = useState(false);
  const [informationLoadingText, setInformationLoadingText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Configuración de las columnas del DataGrid
  const columns = [
    { field: "id", headerName: "ORDER ID", flex: 1 },
    { field: "fecha_registro", headerName: "FECHA DE REGISTRO", flex: 1 },
    { field: "cub_id", headerName: "CUB", flex: 1 },
    { field: "cub_identificacion", headerName: "DOCUMENTO", flex: 1 },
    {
      field: "valor_total",
      headerName: "VALOR TOTAL",
      flex: 1,
      valueFormatter: (params) => `$${params.toLocaleString("es-CO")}`,
    },
    {
      field: "actions",
      headerName: "ACCIONES",
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            {/*<FaPencilAlt*/}
            {/*    style={{ cursor: "pointer", color: "#0d6efd", marginRight: "10px" }}*/}
            {/*    onClick={() => handleEditClick(params.row)}*/}
            {/*/>*/}
            <FaTrash
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDeleteClick(params.row.id)}
            />
          </div>
        );
      },
      sortable: false,
      filterable: false,
    },
  ];

  // Obtener órdenes de compra
  const getPurcharseOrder = async () => {
    setIsLoading(true);
    setInformationLoadingText("Cargando ordenes...");
    try {
      const { page, pageSize } = paginationModel;
      const url = buildUrl(
        page + 1,
        pageSize,
        isSearchActive ? searchQuery : ""
      );

      const { data, status } = await fetchPurchaseOrders(url);
      if (status === ResponseStatusEnum.OK) {
        updateOrderData(data);
      }

      if (
        status === ResponseStatusEnum.BAD_REQUEST ||
        status === ResponseStatusEnum.INTERNAL_SERVER_ERROR
      ) {
        showError("Error", "Error al obtener las órdenes de compra");
      }
    } catch (error) {
      console.error("Error obteniendo las órdenes de compra:", error);
      showError("Error", "Error al comunicarse con el servidor");
    } finally {
      setIsLoading(false);
      setIsSearchActive(false);
    }
  };

  //
  const buildUrl = (page, size, cedula = "") => {
    const params = new URLSearchParams({
      page,
      size,
      ...(cedula && { cedula }),
    });
    return `?${params.toString()}`;
  };

  // Función para llamar al servicio de órdenes de compra
  const fetchPurchaseOrders = async (url) => {
    return await purchaseOrderServices.getAll(url);
  };

  // Actualizar los datos en el estado después de la respuesta exitosa
  const updateOrderData = (data) => {
    setPurcharseOrder(normalizeRows(data.results));
    setRowCountState(data.count);
  };

  // Normaliza los datos recibidos del backend
  const normalizeRows = (data) => {
    return data.map((row) => ({
      id: row?.id,
      cub_id: row?.cub?.cub_id || "",
      cub_identificacion: row?.cub?.identificacion || "",
      cub_nombre: row?.cub?.nombre || "",
      cub_apellido: row?.cub?.apellido || "",
      valor_total: parseFloat(row?.valor_total) || 0,
      fecha_registro: row?.fecha_registro,
    }));
  };

  //
  const showAlert = (title, message) => {
    AlertComponent.success(title, message);
  };

  // Muestra un error con SweetAlert
  const showError = (title, message) => {
    AlertComponent.error(title, message);
  };

  // Maneja el clic en el ícono de eliminación
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // Cierra el modal de confirmación
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  // Confirma la eliminación de un registro
  const handleConfirmDelete = async () => {
    setIsLoading(true);
    setInformationLoadingText("Eliminando orden...");
    try {
      const { data, status } = await purchaseOrderServices.removeOrder(
        selectedId
      );
      if (status === ResponseStatusEnum.NO_CONTENT) {
        showAlert("Bien hecho!", "Orden eliminada exitosamente!");
        await getPurcharseOrder();
        handleCloseModal();
      }

      if (status === ResponseStatusEnum.FORBIDDEN) {
        showError("Error", `No se puede eliminar orde porque ${data}`);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error al eliminar el elemento:", error);
      showError("Error", "No se pudo eliminar la orden");
    } finally {
      setIsLoading(false);
    }
  };

  // Actualiza el valor del campo de búsqueda
  const handleSearchQueryChange = (e) => setSearchQuery(e.target.value);

  // Realiza la búsqueda
  const handleSearch = () => {
    if (searchQuery.length >= 5) {
      setPaginationModel({ ...paginationModel, page: 0 }); // Cambia la página
      setIsSearchActive(true); // Marca como búsqueda activa
    } else {
      showError("Error", "El valor a buscar debe tener al menos 5 caracteres");
    }
  };

  // Limpia la búsqueda
  const handleClearSearch = () => {
    setSearchQuery("");
    setPaginationModel({ page: 0, pageSize: PAGE_SIZE });
  };

  // Ejecuta la consulta inicial al cargar el componente
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getPurcharseOrder();
  }, [paginationModel]);

  return (
    <>
      <Breadcrumb />
      <div className="container-fluid px-4">
        <ModernBanner
          imageHeader={imgDCSIPeople}
          titleHeader="​"
          bannerIcon={orderIcon}
          bannerInformation="Órdenes de Compra"
          backgroundInformationColor="#2148C0"
          infoText="Busca órdenes por documento, consulta detalles y gestiona el estado de las compras."
        />

        <div className="row align-items-center mb-4">
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Buscar por documento..."
              value={searchQuery}
              onChange={handleSearchQueryChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={handleSearch}
                className="d-flex align-items-center"
              >
                <FaSearch className="me-2" />
                Buscar
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleClearSearch}
                className="d-flex align-items-center"
              >
                <FaBroom className="me-2" />
                Limpiar
              </Button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="overlay">
            <div className="loader">{informationLoadingText}</div>
          </div>
        )}

        <StandardTable
          columns={columns}
          rows={purcharseOrder}
          loading={isLoading}
          noRowsText="No hay órdenes de compra disponibles"
          customProps={{
            rowCount: rowCountState,
            paginationModel: paginationModel,
            onPaginationModelChange: setPaginationModel,
            paginationMode: "server",
            pageSizeOptions: [10, 25, 50, 100],
          }}
          enableDynamicHeight={true}
        />

        <ConfirmationModal
          show={showModal}
          title="Confirmación de Eliminación"
          message="¿Estás seguro de que deseas eliminar este elemento?"
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmDelete}
          onClose={handleCloseModal}
        />
      </div>
    </>
  );
};

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import {FaBroom, FaPencilAlt, FaSearch, FaTrash} from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";

// Image
import imgDCSIPeople from "../../../../../assets/image/addProducts/imgDSCIPeople.png";

// Services
import { purchaseOrderServices } from "../../../../../helpers/services/PurchaseOrderServices";

// Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

// Css
import "./OrderReport.css";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Components
import { ConfirmationModal } from "../../../shared/Modals/ConfirmationModal";

const PAGE_SIZE = 100;

export const OrderReport = () => {

    const navigate = useNavigate();

    const [purcharseOrder, setPurcharseOrder] = useState([]);
    const [rowCountState, setRowCountState] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: PAGE_SIZE,
    }); //Paginación
    const [isLoading, setIsLoading] = useState(false);
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
        { field: "valor_total", headerName: "VALOR TOTAL", flex: 1,
          valueFormatter: (params) => `$${params.toLocaleString("es-CO")}`,
        },
        {
            field: "actions",
            headerName: "ACCIONES",
            flex: 1,
            renderCell: (params) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        {/*<FaPencilAlt*/}
                        {/*    style={{ cursor: "pointer", color: "#0d6efd", marginRight: "10px" }}*/}
                        {/*    onClick={() => handleEditClick(params.row)}*/}
                        {/*/>*/}
                        <FaTrash
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => handleDeleteClick(params.row.id)}
                        />
                    </div>
                )},
            sortable: false,
            filterable: false,
        }
    ];

    // Obtener órdenes de compra
    const getPurcharseOrder = async () => {
        setIsLoading(true);
        try {
            const { page, pageSize } = paginationModel;
            const url = buildUrl(page + 1, pageSize, isSearchActive ? searchQuery : "");

            const { data, status } = await fetchPurchaseOrders(url);
            if (status === ResponseStatusEnum.OK) {
                updateOrderData(data);
            }

            if (status === ResponseStatusEnum.BAD_REQUEST || status === ResponseStatusEnum.INTERNAL_SERVER_ERROR) {
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
            id: row.id,
            cub_id: row.cub?.id || "",
            cub_identificacion: row.cub?.identificacion || "",
            cub_nombre: row.cub?.nombre || "",
            cub_apellido: row.cub?.apellido || "",
            valor_total: parseFloat(row?.valor_total) || 0,
            fecha_registro: row?.fecha_registro,
        }));
    }

    //
    const showAlert = (title, message) => {
        AlertComponent.success(title, message);
    };

    // Muestra un error con SweetAlert
    const showError = (title, message) => {
        AlertComponent.error(title, message);
    };

    // Maneja el clic en el ícono de eliminación
    const handleEditClick = (data) => {
        navigate(`/admin/edit-order/${data.id}/${data.cub_id}`)
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
        try {
            const { status } = await purchaseOrderServices.removeOrder(selectedId);
            if (status === ResponseStatusEnum.NO_CONTENT) {
                showAlert("Bien hecho!", "Orden eliminada exitosamente!");
                await getPurcharseOrder();
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error al eliminar el elemento:", error);
            showError("Error", "No se pudo eliminar la orden");
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
    useEffect(() => {
        getPurcharseOrder();
    }, [paginationModel]);

    return (
        <>
            <div className="main-container">
                <div className="header-image position-relative">
                    <img src={imgDCSIPeople} alt="Fondo" className="background-image w-100" />
                    <div className="overlay-text position-absolute w-100 text-center">
                        <h1>¡Órdenes de Compra!</h1>
                    </div>
                </div>

                <div className="container mt-lg-3">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mt-3 mb-3">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            size="md"
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            className="input-responsive"
                        />
                        <div className="d-flex flex-column flex-md-row w-100 w-md-auto">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleSearch}
                                className="button-order-responsive"
                            >
                                Buscar <FaSearch />
                            </Button>
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={handleClearSearch}
                                className="button-order-responsive"
                            >
                                Limpiar <FaBroom />
                            </Button>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="overlay">
                            <div className="loader">Cargando Ordenes...</div>
                        </div>
                    )}

                    <div className="responsive-container">
                        <DataGrid
                            columns={columns}
                            rows={purcharseOrder}
                            rowCount={rowCountState}
                            loading={isLoading}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            paginationMode="server"
                            sx={{
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#40A581",
                                    color: "white",
                                    fontSize: "14px",
                                },
                                "& .MuiDataGrid-columnHeader": {
                                    textAlign: "center",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                },
                                "& .MuiDataGrid-container--top [role=row], .MuiDataGrid-container--bottom [role=row]": {
                                    backgroundColor: "#40A581 !important",
                                    color: "white !important",
                                },
                                "& .MuiDataGrid-cell": {
                                    fontSize: "14px",
                                    textAlign: "center",
                                    justifyContent: "center",
                                    display: "flex",
                                },
                                "& .MuiDataGrid-row:hover": {
                                    backgroundColor: "#E8F5E9",
                                },
                            }}
                        />
                    </div>
                </div>

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

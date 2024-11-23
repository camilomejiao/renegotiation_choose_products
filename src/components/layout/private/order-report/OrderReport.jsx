import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import {FaPencilAlt, FaTrash} from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";

// Image
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";

// Services
import { purchaseOrderServices } from "../../../../helpers/services/PurchaseOrderServices";

// Enum
import { StatusEnum } from "../../../../helpers/GlobalEnum";

// Css
import "./OrderReport.css";

const PAGE_SIZE = 10;

export const OrderReport = () => {
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
        {
            field: "valor_total", headerName: "VALOR TOTAL", flex: 1,
            valueFormatter: (params) => `$${params.toLocaleString("es-CO")}`,
        },
        {
            field: "actions",
            headerName: "ACCIONES",
            flex: 1,
            renderCell: (params) => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <FaPencilAlt
                        style={{ cursor: "pointer", color: "#0d6efd", marginRight: "10px" }}
                        onClick={() => handleEditClick(params.row.id)}
                    />
                    <FaTrash
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => handleDeleteClick(params.row.id)}
                    />
                </div>
            ),
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

            const { status, data } = await fetchPurchaseOrders(url);
            if (status === StatusEnum.OK) {
                updateOrderData(data);
            } else {
                showError("Error", "Error al obtener las órdenes de compra");
            }
        } catch (error) {
            console.error("Error obteniendo las órdenes de compra:", error);
            showError("Error al comunicarse con el servidor");
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
        Swal.fire({
            title: title,
            text: message,
            icon: 'success',
            width: 300,
            heightAuto: true,
        });
    };

    // Muestra un error con SweetAlert
    const showError = (message) => {
        Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
            width: 300,
            heightAuto: true,
        });
    };

    // Maneja el clic en el ícono de eliminación
    const handleEditClick = (id) => {
        setSelectedId(id);
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
            if (status === StatusEnum.NO_CONTENT) {
                showAlert("Bien hecho!", "Orden eliminada exitosamente!");
                await getPurcharseOrder();
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error al eliminar el elemento:", error);
            showError("No se pudo eliminar la orden");
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
            showError("El valor a buscar debe tener al menos 5 caracteres");
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

                <div className="container mt-lg-5">
                    <div className="d-flex flex-wrap align-items-center mt-3 mb-3">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            className="input-responsive me-2 mb-2 mb-md-0"
                        />
                        <Button variant="primary" onClick={handleSearch} className="button-order-responsive me-2 mb-2 mb-md-0">
                            Buscar
                        </Button>
                        <Button variant="secondary" onClick={handleClearSearch} className="button-order-responsive">
                            Limpiar
                        </Button>
                    </div>

                    <div className="responsive-container">
                        <DataGrid
                            rows={purcharseOrder}
                            columns={columns}
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

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Estás seguro de que deseas eliminar este elemento?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

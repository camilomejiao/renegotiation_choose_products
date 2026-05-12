import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaBroom, FaSearch, FaTrash } from "react-icons/fa";
import { Loading } from "../../../shared/loading/Loading";
import { SmartTable } from "../../../../../shared/ui/smart-table";

// Image
import imgDCSIPeople from "../../../../../assets/image/addProducts/imgDSCIPeople.png";

// Services
import { purchaseOrderServices } from "../../../../../helpers/services/PurchaseOrderServices";

// Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

// Css
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Components
import { ConfirmationModal } from "../../../shared/Modals/ConfirmationModal";

const PAGE_SIZE = 100;

export const OrderReport = () => {

    const navigate = useNavigate();

    const [purcharseOrder, setPurcharseOrder] = useState([]);
    const [rowCountState, setRowCountState] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [isLoading, setIsLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);

    // Configuración de las columnas del DataGrid
    const columns = [
        { title: "ORDEN DE COMPRA", dataIndex: "id", key: "id", width: 120 },
        { title: "FECHA DE REGISTRO", dataIndex: "fecha_registro", key: "fecha_registro", width: 180 },
        { title: "CUB", dataIndex: "cub_id", key: "cub_id", width: 120 },
        { title: "DOCUMENTO", dataIndex: "cub_identificacion", key: "cub_identificacion", width: 160 },
        {
          title: "VALOR TOTAL",
          dataIndex: "valor_total",
          key: "valor_total",
          width: 160,
          render: (value) => `$${Number(value || 0).toLocaleString("es-CO")}`,
        },
        {
            title: "ACCIONES",
            dataIndex: "actions",
            key: "actions",
            width: 120,
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        {/*<FaPencilAlt*/}
                        {/*    style={{ cursor: "pointer", color: "#0d6efd", marginRight: "10px" }}*/}
                        {/*    onClick={() => handleEditClick(record)}*/}
                        {/*/>*/}
                        <FaTrash
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => handleDeleteClick(record.id)}
                        />
                    </div>
                )},
        }
    ];

    // Obtener órdenes de compra
    const getPurcharseOrder = async () => {
        setIsLoading(true);
        setInformationLoadingText('Cargando ordenes...');
        try {
            const url = buildUrl(page, pageSize, isSearchActive ? searchQuery : "");

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
            id: row?.id,
            cub_id: row?.cub?.cub_id || "",
            cub_identificacion: row?.cub?.identificacion || "",
            cub_nombre: row?.cub?.nombre || "",
            cub_apellido: row?.cub?.apellido || "",
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
        setIsLoading(true);
        setInformationLoadingText('Eliminando orden...');
        try {
            const { data, status } = await purchaseOrderServices.removeOrder(selectedId);
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
            setPage(1);
            setIsSearchActive(true); // Marca como búsqueda activa
        } else {
            showError("Error", "El valor a buscar debe tener al menos 5 caracteres");
        }
    };

    // Limpia la búsqueda
    const handleClearSearch = () => {
        setSearchQuery("");
        setPage(1);
        setPageSize(PAGE_SIZE);
    };

    // Ejecuta la consulta inicial al cargar el componente
    useEffect(() => {
        getPurcharseOrder();
    }, [page, pageSize]);

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
                    <div className="table-toolbar mt-5">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            size="md"
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            className="input-responsive"
                        />
                        <div className="text-end d-flex">
                            <Button
                                variant="outline-primary"
                                onClick={handleSearch}
                                className="button-order-responsive"
                            >
                                <FaSearch /> Buscar
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={handleClearSearch}
                                className="button-order-responsive"
                            >
                                <FaBroom /> Limpiar
                            </Button>
                        </div>
                    </div>

                    {isLoading && <Loading fullScreen text={informationLoadingText} />}

                    <div style={{ height: 500, width: "100%" }}>
                        <SmartTable
                            rowKey="id"
                            columns={columns}
                            dataSource={purcharseOrder}
                            total={rowCountState}
                            loading={isLoading}
                            currentPage={page}
                            defaultPageSize={pageSize}
                            pageSizeOptions={["25", "50", "100"]}
                            onPageChange={(nextPage, nextPageSize) => {
                                setPage(nextPage);
                                setPageSize(nextPageSize);
                            }}
                            defaultText="---"
                            emptyText="No hay órdenes de compra registradas."
                            enableRowSelection={false}
                            showToolbar={false}
                            showTableResize={false}
                            showColumnSettings={false}
                            scroll={{ x: 1000 }}
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


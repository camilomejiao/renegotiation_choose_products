import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Select from "react-select";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import {
    FaCheck,
    FaClipboardCheck,
    FaFilePdf,
    FaPencilAlt,
    FaSave,
    FaStepBackward,
    FaTimes,
    FaTrash
} from "react-icons/fa";
import printJS from "print-js";
import { DataGrid } from "@mui/x-data-grid";

//Components
import { HeaderImage } from "../../shared/header_image/HeaderImage";
import { UserInformation } from "../../shared/user_information/UserInformation";
import { DeliveryReport } from "./delivery-report/DeliveryReport";
import { ApprovedDeniedModal } from "../../shared/Modals/ApprovedDeniedModal";
import { FEModal } from "../../shared/Modals/FEModal";

//Util
import AlertComponent from "../../../../helpers/alert/AlertComponent";

//Img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgFrame2 from "../../../../assets/image/icons/deliveries-img.png";
import imgAdd from "../../../../assets/image/payments/imgPay.png";

//Services
import { deliveriesServices } from "../../../../helpers/services/DeliveriesServices";
import { userServices } from "../../../../helpers/services/UserServices";
import { supplierServices } from "../../../../helpers/services/SupplierServices";
import { filesServices } from "../../../../helpers/services/FilesServices";

//Css
import './Deliveries.css';

//Enum
import { ResponseStatusEnum, RolesEnum, UploadFileEnum } from "../../../../helpers/GlobalEnum";

//Opciones para los productos a entregar
const deliveryStatus = [
    { id: 0, label: "NO ENTREGADO" },
    { id: 1, label: "ENTREGADO" },
    //{ id: 2, label: "PENDIENTE POR ENTREGAR" },
    { id: 3, label: "ENTREGA PARCIAL" }
];

//
const IMAGE_SLOTS = new Set([UploadFileEnum.EVIDENCE1, UploadFileEnum.EVIDENCE2]);

const isValidImage = (file) => {
    const okMime = file.type?.startsWith('image/');
    const okExt  = /\.(jpe?g|png)$/i.test(file.name || '');
    return okMime || okExt;
};

const isValidPdf = (file) => {
    const okMime = file.type === 'application/pdf';
    const okExt  = /\.pdf$/i.test(file.name || '');
    return okMime || okExt;
};

// ============================
//   HELPERS / CONSTANTS
// ============================

/**
 * Devuelve true si la fila tiene número de factura electrónica (FE).
 * @param {Object} row - Fila del DataGrid.
 */
const hasFeNumber = (row) => row?.fe_number;
/** Roles que pueden editar entregas. */
const canEditRoles = [RolesEnum.TERRITORIAL_LINKS, RolesEnum.SUPPLIER, RolesEnum.ADMIN];

/** Roles que pueden eliminar entregas. */
const canDeleteRoles = [RolesEnum.TERRITORIAL_LINKS, RolesEnum.TECHNICAL, RolesEnum.SUPPLIER, RolesEnum.ADMIN];

/**
 * Devuelve true si la fila tiene consolidado PDF cargado.
 * @param {Object} row - Fila del DataGrid.
 */
const hasPdfConsolidado = (row) => Boolean(row?.evidencePdf?.consolidatedFileUrl);

/**
 * Devuelve la URL del archivo FE (factura electrónica) de la fila.
 * @param {Object} row - Fila del DataGrid.
 */
const getFePdfUrl = (row) => row?.evidencePdf?.feFileUrl ?? null;

/**
 * Devuelve la URL del archivo Imagen1 y Imagen2 de la fila.
 * @param {Object} row - Fila del DataGrid.
 */
const getImagen1Url = (row) => row?.evidenceImg?.imgEvidence1Url ?? null;
const getImagen2Url = (row) => row?.evidenceImg?.imgEvidence2Url ?? null;

/**
 * Devuelve la URL del archivo Imagen1 y Imagen2 (factura electrónica) de la fila.
 * @param {Object} row - Fila del DataGrid.
 */
const hasPdfOK = (row) => Boolean(row?.evidencePdf?.consolidatedFileUrl && row?.evidencePdf?.feFileUrl && row?.evidenceImg?.imgEvidence1Url && row?.evidenceImg?.imgEvidence2Url);

export const Deliveries = () => {

    const { userAuth } = useOutletContext();
    const params = useParams();
    const navigate = useNavigate();
    const deliveryReportRef = useRef();

    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [listDeliveriesToUser, setListDeliveriesToUser] = useState([]);
    const [userData, setUserData] = useState({});
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [deliveryProducts, setDeliveryProducts] = useState([]);
    const [deliveryInformation, setDeliveryInformation] = useState({});
    const [isReadyToPrintDeliveryInformation, setIsReadyToPrintDeliveryInformation] = useState(false);
    const [loading, setLoading] = useState(false);

    //
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [comment, setComment] = useState('');
    const [action, setAction] = useState('approve');

    // FE modal state
    const [showFeModal, setShowFeModal] = useState(false);
    const [feDeliveryId, setFeDeliveryId] = useState(null);
    const [feLoading, setFeLoading] = useState(false);


    /**
     * Obtiene los proveedores asociados al usuario autenticado.
     * - Si el usuario es TERRITORIAL_LINKS, ADMIN o SUPERVISION → consulta todos los proveedores del titular.
     * - Si el usuario es SUPPLIER → consulta solo su proveedor.
     */
    const getSuppliersFromWhomYouPurchased = async () => {
        try {
            if (userAuth.rol_id === RolesEnum.TERRITORIAL_LINKS || userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.SUPERVISION) {
                const { data, status} = await deliveriesServices.getSuppliers(params.id);
                if (status === ResponseStatusEnum.OK) {
                    setSuppliers(data);
                }
            }

            if (userAuth.rol_id === RolesEnum.SUPPLIER) {
                const itemId = await supplierServices.getSupplierId();
                const singleSupplier = [{ id: itemId }];
                setSuppliers(singleSupplier);
            }
        } catch (error) {
            console.error("Error obteniendo proveedores:", error);
        }
    }

    /**
     * Lista las entregas asociadas a un titular (CUB).
     * @param {number} cubId - ID del titular (CUB).
     */
    const getListDeliveriesToUser = async (cubId) => {
        try {
            setLoading(true);
            const { data, status} = await deliveriesServices.searchDeliveriesToUser(cubId);
            if(status === ResponseStatusEnum.OK) {
                const rows = await normalizeDeliveryRows(data);
                setListDeliveriesToUser(rows);
            }
        } catch (error) {
            console.error("Error fetching deliveries:", error);
        } finally {
            setLoading(false);
        }
    }

    //
    const pick = (arr, key) => arr.find(x => String(x?.indice || '').toLowerCase() === key)?.ruta || null;

    /**
     * Obtiene las URLs de archivos (PDF consolidado y FE) y aprobaciones asociadas a una entrega.
     * @param {number} deliveryId - ID de la entrega.
     * @returns {Object} Información de archivos y estados de aprobación.
     */
    const getDeliveryUrl = async (deliveryId) => {
        try {
            const { data, status} = await deliveriesServices.searchDeliveriesPDF(deliveryId);
            if(status === ResponseStatusEnum.OK) {
                const archivos = Array.isArray(data?.archivos) ? data.archivos : [];

                return {
                    consolidatedFileUrl: pick(archivos, 'pdf'),
                    feFileUrl:           pick(archivos, 'fe'),
                    evidence1Url:        pick(archivos, 'evidence_1'),
                    evidence2Url:        pick(archivos, 'evidence_2'),
                    approvedTechnical:   data?.aprobado_tecnica ?? null,
                    approvedTerritorial: data?.aprobado_territorial ?? null,
                    fe_number:           data?.numero_fe ?? null,
                    statusDelivery:      data?.estado ?? null,
                };
            }
        } catch (error) {
            console.error("Error fetching deliveries:", error);
        }
    }

    /**
     * Normaliza el arreglo de entregas para adaptarlo al DataGrid.
     * @param {Array} data - Lista de entregas obtenida desde el backend.
     * @returns {Array} Entregas normalizadas con campos fe_number, evidencePdf, etc.
     */
    const normalizeDeliveryRows = async (data) => {
        return await Promise.all(
            data.map(async (row) => {
                const deliveryIdInfo = await getDeliveryUrl(row?.id);
                return {
                    id: row?.id,
                    date: row?.fecha_creacion.split("T")[0],
                    supplier: row?.proveedor,
                    fe_number: deliveryIdInfo?.fe_number,
                    statusDelivery: deliveryIdInfo?.statusDelivery ?? "",
                    evidencePdf: {
                        consolidatedFileUrl: deliveryIdInfo?.consolidatedFileUrl ?? "",
                        feFileUrl: deliveryIdInfo?.feFileUrl ?? ""
                    },
                    evidenceImg: {
                        imgEvidence1Url: deliveryIdInfo?.evidence1Url ?? "",
                        imgEvidence2Url: deliveryIdInfo?.evidence2Url ?? ""
                    },
                    actions: {
                        approvedTechnical: deliveryIdInfo?.approvedTechnical,
                        approvedTerritorial: deliveryIdInfo?.approvedTerritorial,
                    }
                };
            })
        );
    };

    /**
     * Obtiene información del titular (datos personales).
     * @param {number} cubId - ID del titular.
     */
    const getUserInformation = async (cubId) => {
        try {
            const { data, status} = await userServices.userInformation(cubId);
            if(status === ResponseStatusEnum.OK) {
                setUserData(data);
            }
        } catch (error) {
            console.log(error);
            showError(error, 'Error buscando productos:');
        }
    }

    /**
     * Determina si un botón debe estar deshabilitado según:
     * - Estado de aprobación (territorial o técnica).
     * - Rol del usuario autenticado.
     */
    const isButtonDisabled = (row, rolId = userAuth?.rol_id) => {
        if((row.actions.approvedTerritorial === true || row.actions.approvedTerritorial === false) &&
            (rolId === RolesEnum.TERRITORIAL_LINKS || rolId === RolesEnum.SUPPLIER)) {
            return true;
        }

        if(rolId !== RolesEnum.TERRITORIAL_LINKS && rolId !== RolesEnum.SUPPLIER && rolId !== RolesEnum.ADMIN) {
            return true;
        }
    };

    /**  Determina si el botón técnico debe estar deshabilitado según aprobación. */
    const isButtonDisabledTecnical = (row) => {
        const { approvedTerritorial, approvedTechnical } = row.actions;

        if(approvedTechnical === true) {
            return true;
        }
        return false;
    };

    /** Renderiza el ícono de aprobación (aprobado, denegado o pendiente). */
    const renderApprovalIcon = (status) => {
        if (status === 1 || status === true) {
            return <FaCheck title="Aprobado" style={{ backgroundColor: "#FFF", color: "#28A745" }} />;
        }
        if (status === 0 || status === false) {
            return <FaTimes title="Denegado" style={{ color: "#DC3545" }} />;
        }
        return <FaClipboardCheck title="Pendiente de revisión" style={{ color: "#FFC107" }} />;
    }

    /** Renderiza el botón de generación de acta de entrega. */
    const renderGeneratePdfCell = (params) => (
        <div>
            <Button
                variant="outline-primary"
                onClick={() => handleDeliveryInformationReport(params.row.id)}
                title="Generar acta de entrega (PDF)"
            >
                <FaFilePdf />
            </Button>
        </div>
    );

    /** Renderiza botones de evidencia PDF (subir/ver consolidado). */
    const renderEvidenceCell = (params) => {
        const row = params.row;
        return (
            <div>
                <Button
                    variant="outline-secondary"
                    onClick={() => handleUploadFile(row.id, UploadFileEnum.PDF)}
                    disabled={isButtonDisabled(row)}
                    title="Subir consolidado de entrega (PDF)"
                >
                    Subir PDF
                </Button>

                {hasPdfConsolidado(row) && (
                    <Button
                        variant="outline-success"
                        onClick={() => handleViewFile(row.evidencePdf.consolidatedFileUrl)}
                        style={{ marginLeft: 10 }}
                        title="Ver consolidado"
                    >
                        Ver PDF
                    </Button>
                )}
            </div>
        );
    };


    /** Renderiza la celda de FE (cargar/ver/editar factura electrónica). */
    const renderFeCell = (params) => {
        const row = params.row;
        const canEdit = canEditRoles.includes(userAuth.rol_id);
        const fePdfUrl = getFePdfUrl(row);

        // 1) Sin consolidado -> no hacer nada
        if (!hasPdfConsolidado(row)) return <span>—</span>;

        // 2) Con consolidado pero SIN FE -> botón para cargar FE (PDF + número)
        if (!hasFeNumber(row)) {
            return (
                <div>
                    <Button
                        variant="outline-info"
                        onClick={() => openFeModal(row.id)}
                        disabled={isButtonDisabled(row) || !canEdit}
                        title="Adjuntar factura electrónica (PDF) y número de FE"
                    >
                        Subir FE
                    </Button>
                </div>
            );
        }

        // 3) Con FE -> mostrar "Ver FE" (si hay PDF FE) + número + botón editar (si procede)
        return (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{row.fe_number}</span>
                {fePdfUrl && (
                    <Button
                        variant="outline-success"
                        onClick={() => handleViewFile(fePdfUrl)}
                        title="Ver Docuemnto cargado"
                    >
                        Ver Documento
                    </Button>
                )}

                {canEdit && (
                    <Button
                        variant="outline-warning"
                        onClick={() => openFeModal(row.id)}
                        disabled={isButtonDisabled(row)}
                        title="Editar Documento"
                    >
                        Editar Documento
                    </Button>
                )}
            </div>
        );
    };

    /** Renderiza botones de acciones (editar, eliminar, aprobar). */
    const renderActionsCell = (params) => {
        const row = params.row;
        const canEdit = canEditRoles.includes(userAuth.rol_id);
        const canDelete = canDeleteRoles.includes(userAuth.rol_id);
        const isTL = userAuth.rol_id === RolesEnum.TERRITORIAL_LINKS;
        const isTechOrAdmin = userAuth.rol_id === RolesEnum.TECHNICAL || userAuth.rol_id === RolesEnum.ADMIN;

        return (
            <div>
                {canEdit && (
                    <Button
                        variant="outline-warning"
                        onClick={() => handleEditDelivery(row.id)}
                        style={{ marginRight: 10 }}
                        disabled={isButtonDisabled(row)}
                        title="Editar entrega"
                    >
                        <FaPencilAlt />
                    </Button>
                )}

                {canDelete && (
                    <Button
                        variant="outline-danger"
                        onClick={() => handleDeleteDelivery(row.id)}
                        style={{ marginRight: 10 }}
                        disabled={isButtonDisabled(row)}
                        title="Eliminar entrega"
                    >
                        <FaTrash />
                    </Button>
                )}

                {/* Aprobación Territorial (solo si hay consolidado) */}
                {hasPdfOK(row) && isTL && (
                    <Button
                        style={{ backgroundColor: "#FFF", marginRight: 10 }}
                        onClick={() => {
                            setSelectedDeliveryId(row.id);
                            setOpenModal(true);
                        }}
                        disabled={isButtonDisabled(row)}
                        title="Aprobación territorial"
                    >
                        {renderApprovalIcon(row.actions?.approvedTerritorial)}
                    </Button>
                )}

                {/* Aprobación Técnica/Admin (solo si hay consolidado) */}
                {hasPdfOK(row) && isTechOrAdmin && (
                    <Button
                        style={{ backgroundColor: "#FFF" }}
                        onClick={() => {
                            setSelectedDeliveryId(row.id);
                            setOpenModal(true);
                        }}
                        disabled={isButtonDisabledTecnical(row)}
                        title="Aprobación técnica"
                    >
                        {renderApprovalIcon(row.actions?.approvedTechnical)}
                    </Button>
                )}
            </div>
        );
    };

    const renderPhotoCell = (params) => {
        const row = params.row;
        const imagen1Url = getImagen1Url(row);
        const imagen2Url = getImagen2Url(row);

        return (
            <>
                {hasPdfConsolidado(row) && (
                    <div className="d-flex align-items-center gap-2">
                        <Button
                            variant="outline-secondary"
                            onClick={() => handleUploadFile(row.id, UploadFileEnum.EVIDENCE1)}
                            disabled={isButtonDisabled(row)}
                            title="Subir imagen 1"
                        >
                            Subir Imagen 1
                        </Button>

                        {imagen1Url && (
                            <Button
                                variant="outline-success"
                                onClick={() => handleViewFile(imagen1Url)}
                                title="Ver Docuemnto cargado"
                            >
                                Ver Imagen 1
                            </Button>
                        )}

                        <Button
                            variant="outline-secondary"
                            onClick={() => handleUploadFile(row.id, UploadFileEnum.EVIDENCE2)}
                            disabled={isButtonDisabled(row)}
                            title="Subir imagen 2"
                        >
                            Subir Imagen 2
                        </Button>

                        {imagen2Url && (
                            <Button
                                variant="outline-success"
                                onClick={() => handleViewFile(imagen2Url)}
                                title="Ver Docuemnto cargado"
                            >
                                Ver Imagen 2
                            </Button>
                        )}
                    </div>
                )}
            </>
        );
    }

    //===== Columnas =====
    const deliveryColumns = [
        { field: "id", headerName: "N° ENTREGA", width: 150 },
        { field: "date", headerName: "FECHA", width: 150 },
        { field: "supplier", headerName: "PROVEEDOR", width: 350 },
        {
            field: "generatePdf",
            headerName: "GENERAR ACTA DE ENTREGA",
            width: 200,
            renderCell: renderGeneratePdfCell,
            sortable: false,
            filterable: false,
        },
        {
            field: "evidencePdf",
            headerName: "CONSOLIDADO DE ENTREGA",
            width: 250,
            renderCell: renderEvidenceCell,
            sortable: false,
            filterable: false,
        },
        {
            field: "fe_number",
            headerName: "NÚMERO FE O DOCUMENTO EQUIVALENTE",
            width: 400,
            renderCell: renderFeCell,
            sortable: false,
            filterable: false,
        },
        {
            field: "evidence_photo",
            headerName: "EVIDENCIA FOTOGRAFICA",
            width: 550,
            renderCell: renderPhotoCell,
            sortable: false,
            filterable: false,
        },
        { field: "statusDelivery", headerName: "ESTADO", width: 150 },
        {
            field: "actions",
            headerName: "ACCIONES",
            width: 250,
            renderCell: renderActionsCell,
            sortable: false,
            filterable: false,
        },
    ];

    /**
     * Lanza input file oculto para subir consolidado PDF.
     * Actualiza el estado de la fila una vez subido.
     */
    const handleUploadFile = (rowId, fileName) => {
        const input = document.createElement("input");
        input.type = "file";
        input.style.display = "none";

        // Captura el archivo seleccionado
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFileChange(file, rowId, fileName);

                // Actualizar la fila correspondiente con el nombre del archivo
                setListDeliveriesToUser((prevRows) =>
                    prevRows.map((row) =>
                        row.id === rowId
                            ? { ...row, fileName: file.name, evidencePdf: URL.createObjectURL(file) }
                            : row
                    )
                );
            }
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };

    /**
     * Descarga y abre un PDF en nueva pestaña.
     * @param {string} pdfUrl - URL del archivo PDF.
     */
    const handleViewFile = async (pdfUrl) => {
        if (!pdfUrl) {
            AlertComponent.error('Error', 'No hay un archivo cargado para este producto.');
            return;
        }

        try {
            setLoading(true);
            const res = await filesServices.downloadFile(pdfUrl);

            const { blob, status, type } = res || {};

            if (status === ResponseStatusEnum.OK && blob instanceof Blob) {
                const mime = (type || blob.type || '').toLowerCase();

                // Solo PDF o imágenes
                if (mime.includes('pdf') || mime.startsWith('image/')) {
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank', 'noopener,noreferrer');
                    setTimeout(() => URL.revokeObjectURL(url), 60_000);
                }
            }

            if (status === ResponseStatusEnum.NOT_FOUND) {
                AlertComponent.error('Error', 'No se puede descargar el archivo.');
            }
        } catch (error) {
            console.error("Error al descargar archivo:", error);
        } finally {
            setLoading(false);
        }
    };

    //
    const productsToBeDeliveredColumns = [
        { field: "id", headerName: "COD", flex: 0.5 },
        {
            field: "name",
            headerName: "NOMBRE",
            flex: 2,
            headerAlign: "left",
            renderCell: (params) => (
                <div
                    style={{
                        textAlign: "left",
                        whiteSpace: "normal",
                        overflow: "visible",
                    }}
                >
                    {params?.value}
                </div>
            ),
        },
        {
            field: "description",
            headerName: "DESCRIPCIÓN",
            flex: 3,
            headerAlign: "left",
            renderCell: (params) => (
                <div
                    style={{
                        textAlign: "left",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflow: "visible",
                    }}
                >
                    {params?.value}
                </div>
            ),
        },
        { field: "amount", headerName: "CANT. SOLICITADA", flex: 1 },
        {
            field: "quantityToBeDelivered",
            headerName: "CANT. A ENTREGAR",
            flex: 1,
            renderCell: (params) => {
                return (
                    <Form.Control
                        type="number"
                        className="small-input form-control-sm"
                        value={params?.row?.quantityToBeDelivered}
                        min="0"
                        onChange={(e) =>
                            handleQuantityChange(params?.row?.id, e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "5px",
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                    />
                );
            },
        },
        {
            field: "state",
            headerName: "ESTADO",
            flex: 1.5,
            renderCell: (params) => {
                return (
                    <select
                        value={params?.row?.state}
                        onChange={(e) =>
                            handleStatusChange(params?.row?.id, parseInt(e.target.value))
                        }
                        style={{
                            width: "100%",
                            padding: "5px",
                            fontSize: "14px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            backgroundColor: "white",
                            cursor: "pointer",
                        }}
                    >
                        {deliveryStatus.map((option) => (
                            <option key={option?.id} value={option?.id}>
                                {option?.label}
                            </option>
                        ))}
                    </select>
                );
            },
        },
    ];

    /** Normaliza productos para mostrarlos en tabla de productos a entregar. */
    const normalizeProductsToBeDeliveredRows = (data) => {
        return data.map((row) => ({
            id: row?.id,
            name: row?.nombre,
            description: row?.descripcion,
            amount: row?.cantidad,
            quantityToBeDelivered: row?.quantityToDeliver || 0,
            state: row?.estado,
        }));
    }

    //Crear entrega
    const handleCreateDeliveries = async () => {
        if (!selectedSupplier && userAuth.rol_id === RolesEnum.TERRITORIAL_LINKS) {
            showError('Error', 'Debe escoger al menos una empresa');
            return;
        }
        setListDeliveriesToUser([]);

        const dataSupplier = selectedSupplier ? selectedSupplier.value : suppliers[0].id;

        setLoading(true);
        try {
            const { data, status} = await deliveriesServices.productsToBeDelivered(dataSupplier, params.id);

            if (data.length <= 0) {
                showInfo("Error", "No tienes productos pendientes");
                setShowDeliveryForm(false);

                setTimeout(() => {
                    refreshPage();
                }, 1500);

                return;
            }

            if (status === ResponseStatusEnum.OK  && data.length > 0) {
                const updatedData = data.map(product => ({
                    ...product,
                    estado: 1,
                    quantityToDeliver: product.cantidad
                }));
                setDeliveryProducts(normalizeProductsToBeDeliveredRows(updatedData));
                setShowDeliveryForm(true);
            }

            if (status === ResponseStatusEnum.BAD_REQUEST) {
                showError("Error", "Error al obtener las órdenes de compra");
            }
        } catch (error) {
            console.error("Error obteniendo productos a entregar:", error);
        } finally {
            setLoading(false);
        }
    }

    //
    const handleEditDelivery = async (id) => {
        navigate(`/admin/edit-delivery-order/${id}`)
    }

    //
    const handleDeleteDelivery = async (id) => {
        try {
            const { status} = await deliveriesServices.removeDelivery(id);
            if (status === ResponseStatusEnum.NO_CONTENT) {
                showAlert('Éxito', 'Entrega eliminada exitosamente');
                refreshPage();
            }

            if (status === ResponseStatusEnum.METHOD_NOT_ALLOWED) {
                showError('Error', 'NO TIENES PERMISO PARA ESTA ACCIÓN');
            }

            if (status === ResponseStatusEnum.FORBIDDEN) {
                showError('Error', 'NO SE PUEDE ELIMINAR ESTA ENTREGA');
            }
        } catch (error) {
            console.error("Error eliminando la entrega:", error);
        }
    }

    const handleApproveByAudit = async () => {
        if (!action || comment.trim() === "") {
            showError("Validación", "Debes seleccionar una acción o escribir un comentario.");
            return;
        }

        try {
            const aprobado = action === 'approve' ? 1 : 0;
            const payload = {
                aprobado,
                observacion: comment
            };

            const { status } = await deliveriesServices.approveDelivery(selectedDeliveryId, payload);
            if (status === ResponseStatusEnum.OK) {
                getListDeliveriesToUser(params.id);
                showAlert("Bien hecho!", `Entrega ${action === 'approve' ? 'Aprobada' : 'Denegada'} exitosamente!`);
                handleCloseModalApproved();
            }
        } catch (error) {
            console.error("Error al aprobar la entrega:", error);
        }
    };

    const handleCloseModalApproved = () => {
        setOpenModal(false);
        setComment('');
        setAction('approve');
    };

    /**
     * Maneja el envío de archivos al backend (consolidado o FE).
     * @param {File}   file
     * @param {number} deliveryId
     * @param {string} fileName - "pdf" (consolidado) | "fe" (factura electrónica)
     * @param {string} [numeroFE] - Solo se envía cuando fileName === "fe"
     */
    const handleFileChange = async (file, deliveryId, fileName, numeroFE) => {
        if (file) {
            const expectImage = IMAGE_SLOTS.has(fileName);

            const valid = expectImage ? isValidImage(file) : isValidPdf(file);
            if (!valid) {
                showError(
                    'Archivo no válido',
                    expectImage
                        ? 'Solo se permiten imágenes (JPG, PNG).'
                        : 'Solo se permite PDF.'
                );
                refreshPage();
                return;
            }

            const MAX_SIZE = expectImage ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB img, 10MB pdf
            if (file.size > MAX_SIZE) {
                showError(
                    'Archivo muy grande',
                    expectImage
                        ? 'La imagen no debe superar 5 MB.'
                        : 'El PDF no debe superar 10 MB.'
                );
                refreshPage();
                return;
            }

            const formData = new FormData();
            formData.append("ruta", file);
            formData.append("indice", fileName);
            if (fileName === UploadFileEnum.FE && numeroFE) {
                formData.append("numero_fe", numeroFE);
            }

            try {
                const { status } = await deliveriesServices.evidenceOfDeliveries(deliveryId, formData);

                if (status === ResponseStatusEnum.CREATED) {
                    showAlert('Éxito', 'Archivo enviado exitosamente');
                    //refreshPage();
                    await getListDeliveriesToUser(params.id);
                }

                if (status === ResponseStatusEnum.BAD_REQUEST ||
                    status === ResponseStatusEnum.INTERNAL_SERVER_ERROR ||
                    status !== ResponseStatusEnum.CREATED) {
                    showError('Error', 'Error al enviar el archivo');
                }
            } catch (error) {
                console.error("Error al enviar el archivo:", error);
                showError('Error', 'Error al enviar el archivo');
            }
        }
    };

    const handleDeliveryInformationReport = async (deliveryId) => {
        setLoading(true);
        try {
            const { data } = await deliveriesServices.deliveryReport(deliveryId);
            setDeliveryInformation(data);
            setIsReadyToPrintDeliveryInformation(true);
        } catch (error) {
            console.error("Error obteniendo el reporte:", error);
            showError('Error', 'Error obteniendo el reporte:');
        } finally {
            setLoading(false);
        }
    }

    const handlePDFPrint = () => {
        const printContent = `
            <html>
                <head>
                  <style>           
                    body {
                      font-family: Arial, sans-serif;
                      margin: 20px;
                      font-size: 10px;
                    }
                    .page-break {
                        page-break-after: always;
                    }
                  </style>
                </head>
                <body>
                  <!-- Inyectamos el HTML del componente -->
                  ${deliveryReportRef.current.innerHTML} 
                </body>
            </html>`;

        printJS({
            printable: printContent,
            type: 'raw-html',
            documentTitle: 'Acta De Entrega',
        });
    }

    /** Maneja cambio de cantidad a entregar en tabla de productos. */
    const handleQuantityChange = (id, value) => {
        const newProducts = deliveryProducts.map((product) => {
            if (product.id === id) {
                return { ...product, quantityToBeDelivered: value.trim() === '' ? '' : Math.max(0, Number(value)) };
            }
            return product;
        });
        setDeliveryProducts(newProducts);
    };

    /** Maneja cambio de estado de producto (entregado, no entregado, parcial). */
    const handleStatusChange = (id, value) => {
        const newProducts = deliveryProducts.map((product) => {
            if (product.id === id) {
                return { ...product, state: value };
            }
            return product;
        });
        setDeliveryProducts(newProducts);
    };

    /** Maneja cambio de estado de producto (entregado, no entregado, parcial). */
    const handleSaveProduct = async () => {
        try {
            //
            const dataSaveProducts = deliveryProducts.map(prod => ({
                producto: prod?.id,
                cantidad: prod?.quantityToBeDelivered,
                estado: prod?.state
            }));

            const dataSupplier = selectedSupplier ? selectedSupplier.value : suppliers[0].id;

            const {data, status} = await deliveriesServices.saveProducts(dataSupplier, params.id, dataSaveProducts);
            if(status === ResponseStatusEnum.OK) {
                showAlert('Éxito', 'Productos entregados correctamente.')
                refreshPage();
            }

            if(status === ResponseStatusEnum.BAD_REQUEST) {
                showError('Error', `${data}`);
            }
        } catch (error) {
            showError('Error al guardar los productos', `${error}`);
        }
    };

    /** */
    const openFeModal = (deliveryId) => {
        setFeDeliveryId(deliveryId);
        setShowFeModal(true);
    };

    /** */
    const closeFeModal = () => {
        setShowFeModal(false);
        setFeDeliveryId(null);
    };


    //
    const handleSaveFe = async ({ feNumber, feFile }) => {
        try {
            setFeLoading(true);

            // Guardas FE (archivo + número)
            await handleFileChange(feFile, feDeliveryId, UploadFileEnum.FE, feNumber);

            // Refrescas la tabla completa
            await getListDeliveriesToUser(params.id);

            showAlert("¡Listo!", "Factura electrónica registrada.");
            closeFeModal();
        } catch (error) {
            console.error(error);
            showError("Error", "No se pudo registrar la FE.");
        } finally {
            setFeLoading(false);
        }
    };


    //
    const showAlert = (title, message) => {
        AlertComponent.success(title, message)
    };

    //
    const showError = (title, message) => {
        AlertComponent.error(title, message);
    };

    const showInfo = (title, message) => {
        AlertComponent.info(title, message);
    };

    const refreshPage = () => {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    useEffect(() => {
        if(isReadyToPrintDeliveryInformation) {
         handlePDFPrint();
         setIsReadyToPrintDeliveryInformation(false);
        }
    }, [isReadyToPrintDeliveryInformation]);

    //Al cargar el componente
    useEffect(() => {
        if (params.id) {
            getSuppliersFromWhomYouPurchased();
            getListDeliveriesToUser(params.id);
            getUserInformation(params.id);
        }
    }, [params.id]);

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgDCSIPeople}
                    titleHeader={'Entrega de productos'}
                    bannerIcon={imgAdd}
                    backgroundIconColor={'#2148C0'}
                    bannerInformation={'Aquí podrás realizar la entrega de todos tus productos.'}
                    backgroundInformationColor={'#F66D1F'}
                />

                {/* Contenedor de la información del usuario */}
                <UserInformation userData={userData} />

                <div className="deliveries-banner">
                    <Container>
                        <Row className="justify-content-start align-items-center mt-4">
                            <>
                                {(userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.TERRITORIAL_LINKS) && (
                                    <Col xs={12} md={6} className="d-flex align-items-center">
                                        <Select
                                            value={selectedSupplier}
                                            onChange={(selectedOption) => setSelectedSupplier(selectedOption)}
                                            options={suppliers?.map((opt) => ({ value: opt.id, label: opt.nombre }))}
                                            placeholder="Selecciona una compañía"
                                            classNamePrefix="custom-select"
                                            className="custom-select w-100"
                                        />
                                    </Col>
                                )}

                                {(userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.SUPPLIER || userAuth.rol_id === RolesEnum.TERRITORIAL_LINKS) && (
                                    <Col xs={12} md={6} className="d-flex align-items-center justify-content-md-start justify-content-center">
                                        <button
                                            onClick={handleCreateDeliveries}
                                            className="deliveries-button deliveries d-flex align-items-center"
                                        >
                                            <img src={imgFrame2} alt="icono único" className="button-icon" />
                                            CREAR ENTREGAS
                                        </button>
                                    </Col>
                                )}
                            </>
                        </Row>
                    </Container>
                </div>

                {loading && (
                    <div className="spinner-container">
                        <Spinner animation="border" variant="success" />
                        <span>Cargando...</span>
                    </div>
                )}

                <div className="">
                    <Container>
                        <hr/>
                        {listDeliveriesToUser.length > 0 && !showDeliveryForm ? (
                            <>
                                <DataGrid
                                    rows={listDeliveriesToUser}
                                    columns={deliveryColumns}
                                    pageSize={10}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    disableColumnMenu
                                    disableSelectionOnClick
                                    rowHeight={100}
                                    componentsProps={{
                                        columnHeader: {
                                            style: {
                                                textAlign: "left",
                                                fontWeight: "bold",
                                                fontSize: "10px",
                                                wordWrap: "break-word",
                                            },
                                        },
                                    }}
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
                                <div className="button-container mt-2 d-flex flex-md-row flex-column justify-content-md-end justify-content-center">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate(-1)}
                                        className="responsive-button mb-2 mb-md-0"
                                    >
                                        <FaStepBackward /> ATRÁS
                                    </Button>
                                </div>
                            </>

                        ) : (
                            !showDeliveryForm && (
                                <div className="text-center mt-4">
                                    <p>No se han realizado entregas.</p>
                                </div>
                            )
                        )}

                        {showDeliveryForm && (
                            <>
                                <DataGrid
                                    rows={deliveryProducts}
                                    columns={productsToBeDeliveredColumns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    disableColumnMenu
                                    disableSelectionOnClick
                                    componentsProps={{
                                        columnHeader: {
                                            style: {
                                                textAlign: "left", // Alinea los títulos a la izquierda
                                                fontWeight: "bold", // Opcional: Aplica un peso específico
                                                fontSize: "14px", // Ajusta el tamaño de fuente
                                                wordWrap: "break-word", // Permite que el título se divida en varias líneas
                                            },
                                        },
                                    }}
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

                                <div className="button-container mt-2 d-flex flex-md-row flex-column justify-content-md-end justify-content-center">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate(refreshPage())}
                                        className="responsive-button mb-2 mb-md-0"
                                    >
                                        <FaStepBackward /> ATRÁS
                                    </Button>

                                    <Button
                                        variant="outline-success"
                                        onClick={handleSaveProduct}
                                        className="responsive-button"
                                    >
                                        <FaSave /> GUARDAR ENTREGA
                                    </Button>
                                </div>
                            </>
                    )}
                    </Container>
                </div>

                {/* Aquí renderizas el componente pero lo ocultas */}
                <div style={{display: 'none'}}>
                    {isReadyToPrintDeliveryInformation && (
                        <div ref={deliveryReportRef}>
                            <DeliveryReport deliveryInformation={deliveryInformation} />
                        </div>
                    )}
                </div>

                {/* Modal de aprobación/denegación */}
                <ApprovedDeniedModal
                    open={openModal}
                    onClose={handleCloseModalApproved}
                    action={action}
                    setAction={setAction}
                    comment={comment}
                    setComment={setComment}
                    onSubmit={handleApproveByAudit}
                />

                {/* Modal de FE */}
                <FEModal
                    show={showFeModal}
                    onClose={closeFeModal}
                    loading={feLoading}
                    onSave={handleSaveFe}
                />

            </div>
        </>
    )
}
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Form, Col, Row } from "react-bootstrap";
import { FaStepBackward } from "react-icons/fa";

//Components
import { UserInformation } from "../../../../shared/user_information/UserInformation";
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
import { PaymentsConfirmationModal } from "../../../../shared/Modals/PaymentsConfirmationModal";
import { PlanHistory } from "../../../../shared/Modals/PlanHistory";

//helper
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";

//Img
import downloadImg from "../../../../../../assets/image/payments/download.png";
import checkImg from "../../../../../../assets/image/payments/check.png";
import closeImg from "../../../../../../assets/image/payments/close.png";
import imgPayments from "../../../../../../assets/image/payments/payments.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";

//Css
import './ReviewDocuments.css';

//Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";
import { filesServices } from "../../../../../../helpers/services/FilesServices";

//Enum
import {
    DeliveryDocumentReviewAction,
    InvoiceValueRange,
    ResponseStatusEnum,
    RolesEnum
} from "../../../../../../helpers/GlobalEnum";

import { renegotiationServices } from "../../../../../../helpers/services/RenegociationServices";

//Helpers
const isValidDate = (v) => !!v && !Number.isNaN(new Date(v).getTime());

/* Roles que pueden ver opciones */
const canShowSupervisionRole = [RolesEnum.ADMIN, RolesEnum.SUPERVISION];
const canShowPaymentsRole = [RolesEnum.PAYMENTS, RolesEnum.TRUST_PAYMENTS];

export const ReviewDocuments = () => {
    const { userAuth } = useOutletContext();
    const canShowSupervision = canShowSupervisionRole.includes(userAuth.rol_id);
    const canShowPayments = canShowPaymentsRole.includes(userAuth.rol_id);

    const params = useParams();
    const navigate = useNavigate();

    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [beneficiaryInformation, setBeneficiaryInformation] = useState({});
    const [showModal, setShowModal] = useState(false);

    const [okOrden, setOkOrden] = useState(false);
    const [okActa, setOkActa] = useState(false);
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [fechaFactura, setFechaFactura] = useState("");
    const [valorFactura, setValorFactura] = useState("");

    //
    const [modalAction, setModalAction] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    //
    const [showModalPlanHistory, setShowModalPlanHistory] = useState(false);
    const [planHistoryData, setPlanHistoryData] = useState("");


    const getBeneficiaryInformation = async (deliberyId) => {
        setLoading(true);
        try {
            setInformationLoadingText("Obteniendo información");
            const {data, status} = await paymentServices.getReviewApprovedDeliveriesById(deliberyId);
            if(status === ResponseStatusEnum.OK) {
                setBeneficiaryInformation(data);
                setValorFactura(data?.valor)
            }
        } catch (error) {
            console.error("Error obteniendo el detalle de la entrega:", error);
        } finally {
            setLoading(false);
        }
    }

    //
    const handleViewFile = async (pdfUrl) => {
        if (!pdfUrl) {
            AlertComponent.error('Error', 'No hay un archivo cargado para esta entrega.');
            return;
        }
        setLoading(true);
        try {
            setInformationLoadingText("Obteniendo archivo");

            const { blob, status, type } = await filesServices.downloadFile(pdfUrl?.url_descarga);

            if (status === ResponseStatusEnum.OK && blob instanceof Blob) {
                const mime = (type || blob.type || '').toLowerCase();

                // Solo PDF o imágenes
                if (mime.includes('pdf') || mime.startsWith('image/')) {
                    const fileURL = URL.createObjectURL(blob);
                    window.open(fileURL, '_blank');
                }
            }

            if (status === ResponseStatusEnum.NOT_FOUND) {
                AlertComponent.error('Error', 'No se puede descargar el archivo, archivo no encontrado.');
            }
        } catch (error) {
            console.error("Error al descargar archivo:", error);
        } finally {
            setLoading(false);
        }
    };

    const onBack = () => {
        navigate(`/admin/payments/${params.role}`);
    }

    //
    const openModal = (action) => {
        setModalAction(action);
        setShowModal(true);
        if (action === "aprobar") {
            setSelectedRole(null);
        }
    };

    //
    const handlePlanHistory = async (cubId) => {
        try {
            setLoading(true);
            const {data, status} = await renegotiationServices.getPlanHistory(cubId);
            if (status === ResponseStatusEnum.OK) {
                setPlanHistoryData(data);
                setShowModalPlanHistory(true);
            }
        } catch (error) {
            console.log(error);
            AlertComponent.error("Error", "NO se pudo obtener el historico del beneficiario");
        } finally {
            setLoading(false);
        }
    }

    //
    const handleConfirmModal = async () => {
        if (modalAction === DeliveryDocumentReviewAction.DENY) {
            if (!selectedRole) {
                AlertComponent.warning("Seleccione el rol encargado de subsanar.");
                return;
            }
            await approveAndDeny(DeliveryDocumentReviewAction.DENY, selectedRole);
        } else if (modalAction === DeliveryDocumentReviewAction.APPROVE) {
            await approveAndDeny(DeliveryDocumentReviewAction.APPROVE);
        }

        handleCloseModal();
    };

    //
    const handleCloseModal = () => {
        setShowModal(false);
        setModalAction(null);
        setSelectedRole(null);
        setShowModalPlanHistory(false);
        setPlanHistoryData("");
    };

    //
    const approveAndDeny = async (accion, rolDestinoId = null) => {
        if (accion === DeliveryDocumentReviewAction.DENY && !comments.trim()) {
            AlertComponent.warning("Debe escribir una observación para denegar la entrega.");
            setLoading(false);
            return;
        }

        const ok = validateSupervisionFields(userAuth.rol_id);
        if (!ok) return;

        const payload = {
            aprobado: accion === DeliveryDocumentReviewAction.APPROVE ? 1 : 0,
            observacion:
                accion === DeliveryDocumentReviewAction.APPROVE ? "La entrega cumple con todos los requisitos." : comments,
            ...(accion === DeliveryDocumentReviewAction.DENY && rolDestinoId
                ? { rol_destino: rolDestinoId }
                : { }),
            fecha_entrega: canShowSupervision ? fechaEntrega : null,
            fecha_factura: canShowSupervision ? fechaFactura : null,
            valor_factura: valorFactura,
            acta_entrega_correcta: canShowSupervision ? okActa : null,
            orden_compra_correcta: canShowSupervision ? okOrden : null,
        };

        console.log('payload: ', payload);

        try {
            setLoading(true);
            setInformationLoadingText("Guardando");
            const {data, status} = await paymentServices.approveOrDenyPayments(payload, params.id, accion);
            if(status === ResponseStatusEnum.OK) {
                AlertComponent.success('', `${accion} exitosamente!`);
                navigate(`/admin/payments/${params.role}`);
            }

            if(status === ResponseStatusEnum.BAD_REQUEST) {
                AlertComponent.warning('', `${data.detail}`);
            }
        } catch (error) {
            console.error("Error al aprobar o denegar:", error);
        } finally {
            setLoading(false);
        }

    };

    //
    const getDenyDestinationOptions = (userRole, RolesEnum) => {
        if ([RolesEnum.PAYMENTS, RolesEnum.TRUST_PAYMENTS].includes(userRole)) {
            return [{ id: RolesEnum.SUPPLIER, label: "Proveedor" }];
        }
        if (userRole === RolesEnum.SUPERVISION) {
            return [
                { id: RolesEnum.TERRITORIAL_LINKS, label: "Territorial" },
                { id: RolesEnum.TECHNICAL, label: "Técnica" },
                { id: RolesEnum.SUPPLIER, label: "Proveedor" },
            ];
        }
        return [];
    };

    //
    const denyDestinationOptions = useMemo(
        () => getDenyDestinationOptions(userAuth?.rol_id, RolesEnum),
        [userAuth?.rol_id]
    );

    // Valor de la entrega desde backend (número)
    const valorEntrega = useMemo(
        () => Number(beneficiaryInformation?.valor ?? 0),
        [beneficiaryInformation?.valor]
    );

    //
    const validateSupervisionFields = (role) => {
        // Checks obligatorios
        if ((!okOrden || !okActa) && role === RolesEnum.SUPERVISION) {
            AlertComponent.warning("Debes marcar 'Orden de compra' y 'Acta de entrega' para aprobar.");
            return false;
        }
        // Fechas obligatorias
        if ((!isValidDate(fechaEntrega) || !isValidDate(fechaFactura)) && role === RolesEnum.SUPERVISION) {
            AlertComponent.warning("Debes seleccionar 'Fecha de entrega' y 'Fecha de factura'.");
            return false;
        }
        //Valor obligatorio e igual a valor de la entrega
        const vFactura = Number(String(valorFactura).replace(/[^\d.-]/g, "")) || 0;
        if (vFactura <= 0) {
            AlertComponent.warning("Ingresa el 'Valor de factura'.");
            return false;
        }
        //
        let newValorEntrega = valorEntrega - InvoiceValueRange.INVOICEVALUERANGE;
        if (vFactura > valorEntrega || vFactura < newValorEntrega) {
            AlertComponent.warning('Ojo!',
                `El 'Valor de factura es de' (${vFactura.toLocaleString('es-CO')}) debe ser IGUAL al 'Valor de la entrega' (${valorEntrega.toLocaleString('es-CO')}) ó menor hasta 1000 pesos por debajo del valor de la entrega.`
            );
            return false;
        }

        return true;
    };

    //Feedback entre fechas
    const handleFechaFacturaChange = (value) => {
        setFechaFactura(value);
        if (isValidDate(value) && isValidDate(fechaEntrega)) {
            if (new Date(value) < new Date(fechaEntrega)) {
                AlertComponent.warning("La 'Fecha de factura' no puede ser menor que la 'Fecha de entrega'.");
            }
        }
    };

    //Feedback valor de la factura
    const handleValorFacturaBlur = () => {
        const vFactura = Number(String(valorFactura).replace(/[^\d.-]/g, "")) || 0;

        let newValorEntrega = valorEntrega - InvoiceValueRange.INVOICEVALUERANGE;
        if (vFactura && valorEntrega && (vFactura > valorEntrega || vFactura < newValorEntrega)) {
            AlertComponent.warning('Ojo!',
                `El 'Valor de factura es' (${vFactura.toLocaleString('es-CO')}) y deberia ser IGUAL al 'Valor de la entrega' (${valorEntrega.toLocaleString('es-CO')}) ó menor hasta 1000 pesos por debajo del valor de la entrega.`
            );
        }
    };

    useEffect(() => {
        if(params.id) {
            getBeneficiaryInformation(params.id);
        }
    }, [params.id]);

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Proceso de pago'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás revisar el detalle de cada entrega para orden de pago.'}
                backgroundInformationColor={'#F66D1F'}
            />

            <div className="content-review-documents">

                {!loading && beneficiaryInformation?.beneficiario && (
                    <UserInformation userData={beneficiaryInformation.beneficiario} />
                )}

                {loading && (
                    <div className="overlay">
                        <div className="loader">{informationLoadingText}</div>
                    </div>
                )}

                <div className="content-review-documents" >
                    <Row className="mb-4">
                        <Col md={6}>
                            <h5 className="section-title">Proveedor</h5>
                            <div><strong>Nombre:</strong> {beneficiaryInformation?.proveedor?.nombre}</div>
                            <div><strong>NIT:</strong> {beneficiaryInformation?.proveedor?.nit}</div>
                            <div><strong>Resolución:</strong> {beneficiaryInformation?.proveedor?.resolucion}</div>
                        </Col>

                        <Col md={6}>
                            <div className="total_">
                                <strong>Numero Entrega: {beneficiaryInformation?.id} </strong> <br/>
                                <strong>Valor Entrega: ${parseFloat(beneficiaryInformation?.valor).toLocaleString('es-CO')} </strong>
                            </div>
                        </Col>
                    </Row>

                    {loading && (
                        <div className="overlay">
                            <div className="loader">{informationLoadingText}</div>
                        </div>
                    )}

                    <Row className="mb-4">
                        <Col md={4} xs={12} className="observations-history mt-4">
                            <h5 className="section-title">Historial de revisiones</h5>
                            {beneficiaryInformation?.revisiones_pagos?.map((rev, idx) => (
                                <div key={idx} className={`revision-box ${rev.aprobado ? 'approved' : 'denied'}`}>
                                    <div><strong>Usuario:</strong> {rev.correo}</div>
                                    <div><strong>Estado:</strong> {rev.aprobado ? '✅ Aprobado' : '❌ Denegado'}</div>
                                    <div><strong>Fecha:</strong> {new Date(rev.fecha_aprobacion).toLocaleString()}</div>
                                    <div><strong>Observación:</strong> {rev.observacion}</div>
                                </div>
                            ))}
                        </Col>

                        {canShowSupervision && (
                            <>
                                <Col md={4} xs={12} className="documents-download mt-4">
                                    <h5 className="section-title">Documentos adjuntos</h5>
                                    {beneficiaryInformation?.archivos?.legalizacion?.url_descarga && (
                                        <button className="button-download"
                                                onClick={() => handleViewFile(beneficiaryInformation?.archivos?.legalizacion)}
                                                disabled={beneficiaryInformation?.archivos?.legalizacion?.url_descarga === "None"}>
                                            <img src={downloadImg} alt="" /> Legalizacion
                                        </button>
                                    )}
                                    {beneficiaryInformation?.archivos?.orden_compra?.url_descarga && (
                                        <button className="button-download"
                                                onClick={() => handleViewFile(beneficiaryInformation?.archivos?.orden_compra)}
                                                disabled={beneficiaryInformation?.archivos?.orden_compra?.url_descarga === "None"}>
                                            <img src={downloadImg} alt="" /> Plan de inversión
                                        </button>
                                    )}
                                    {beneficiaryInformation?.archivos?.acta_entrega?.url_descarga && (
                                        <button className="button-download"
                                                onClick={() => handleViewFile(beneficiaryInformation?.archivos?.acta_entrega)}
                                                disabled={beneficiaryInformation?.archivos?.acta_entrega?.url_descarga === "None"}>
                                            <img src={downloadImg} alt="" /> Acta de entrega
                                        </button>
                                    )}
                                    {beneficiaryInformation?.archivos?.factura_electronica?.url_descarga && (
                                        <button className="button-download"
                                                onClick={() => handleViewFile(beneficiaryInformation?.archivos?.factura_electronica)}
                                                disabled={beneficiaryInformation?.archivos?.factura_electronica?.url_descarga === "None"}>
                                            <img src={downloadImg} alt="" /> FE Ó Documento Equivalente
                                        </button>
                                    )}
                                    {beneficiaryInformation?.archivos?.evidencia1?.url_descarga && (
                                        <button className="button-download"
                                                onClick={() => handleViewFile(beneficiaryInformation?.archivos?.evidencia1)}
                                                disabled={beneficiaryInformation?.archivos?.evidencia1?.url_descarga === "None"}>
                                            <img src={downloadImg} alt="" /> Evidencia 1
                                        </button>
                                    )}
                                    {beneficiaryInformation?.archivos?.evidencia2?.url_descarga && (
                                        <button className="button-download"
                                                onClick={() => handleViewFile(beneficiaryInformation?.archivos?.evidencia2)}
                                                disabled={beneficiaryInformation?.archivos?.evidencia2?.url_descarga === "None"}>
                                            <img src={downloadImg} alt="" /> Evidencia 2
                                        </button>
                                    )}
                                </Col>

                                <Col md={4} xs={12} className="documents-download mt-4">
                                    <h5 className="section-title">Validaciones Supervisión</h5>

                                    <button
                                        className="button-download_histoy"
                                        onClick={() => handlePlanHistory(beneficiaryInformation?.beneficiario?.id)}
                                    >
                                        <img src={downloadImg} alt="" /> Historial planes de inversión
                                    </button>

                                    {/* Card visual de la sección */}
                                    <div className="supervision-card">
                                        <Form>
                                            {/* Fechas */}
                                            <Row className="g-2">
                                                <Col xs={12} className="supervision-field">
                                                    <Form.Label>Fecha de entrega</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        className="rb-input"
                                                        value={fechaEntrega}
                                                        onChange={(e) => setFechaEntrega(e.target.value)}
                                                        disabled={loading}
                                                        onKeyDown={(e) => e.preventDefault()}
                                                    />
                                                </Col>

                                                <Col xs={12} className="supervision-field">
                                                    <Form.Label>Fecha de factura</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        className="rb-input"
                                                        value={fechaFactura}
                                                        onChange={(e) => handleFechaFacturaChange(e.target.value)}
                                                        disabled={loading}
                                                        onKeyDown={(e) => e.preventDefault()}
                                                        //min={fechaEntrega}
                                                    />
                                                </Col>
                                            </Row>

                                            {/* Valor */}
                                            <div className="supervision-field">
                                                <Form.Label>Valor de factura</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    inputMode="numeric"
                                                    className="rb-input"
                                                    value={valorFactura}
                                                    onChange={(e) => setValorFactura(e.target.value)}
                                                    onBlur={handleValorFacturaBlur}
                                                    disabled={loading}
                                                />
                                                <div className="field-hint">
                                                    Valor de la entrega: <strong>$ {valorEntrega.toLocaleString('es-CO')}</strong>
                                                </div>
                                            </div>

                                            <div className="supervision-sep" />

                                            {/* Checks */}
                                            <Form.Check
                                                id="orden-ok"
                                                type="checkbox"
                                                className="supervision-check"
                                                label="Orden de compra"
                                                checked={okOrden}
                                                onChange={(e) => setOkOrden(e.target.checked)}
                                                disabled={loading}
                                            />

                                            <Form.Check
                                                id="acta-ok"
                                                type="checkbox"
                                                className="supervision-check"
                                                label="Acta de entrega"
                                                checked={okActa}
                                                onChange={(e) => setOkActa(e.target.checked)}
                                                disabled={loading}
                                            />
                                        </Form>
                                    </div>
                                </Col>
                            </>
                        )}

                        {canShowPayments && (
                            <>
                                <Col md={4} xs={12} className="documents-download mt-4">
                                    <h5 className="section-title">Documentos adjuntos</h5>
                                    {beneficiaryInformation?.archivos?.acta_entrega?.url_descarga && (
                                        <button className="button-download"
                                                onClick={() => handleViewFile(beneficiaryInformation?.archivos?.acta_entrega)}>
                                            <img src={downloadImg} alt="" /> Acta de entrega
                                        </button>
                                    )}
                                    {beneficiaryInformation?.archivos?.factura_electronica?.url_descarga && (
                                        <button className="button-download"
                                                onClick={() => handleViewFile(beneficiaryInformation?.archivos?.factura_electronica)}>
                                            <img src={downloadImg} alt="" /> FE Ó Documento Equivalente
                                        </button>
                                    )}
                                </Col>

                                <Col md={4} xs={12} className="documents-download mt-4">
                                    <h5 className="section-title">Validaciones Pagos</h5>

                                    {/* Card visual de la sección */}
                                    <div className="supervision-card">
                                        <Form>
                                            {/* Valor */}
                                            <div className="supervision-field">
                                                <Form.Label>Valor de factura</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    inputMode="numeric"
                                                    className="rb-input"
                                                    value={valorFactura}
                                                    onChange={(e) => setValorFactura(e.target.value)}
                                                    onBlur={handleValorFacturaBlur}
                                                    disabled={loading}
                                                />
                                                <div className="field-hint">
                                                    Valor de la entrega: <strong>$ {valorEntrega.toLocaleString('es-CO')}</strong>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>

                                </Col>
                            </>
                        )}
                    </Row>
                </div>

                <Row className="observations my-3 mt-3">
                    <Col>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comments}
                            placeholder="Observaciones"
                            onChange={(e) => setComments(e.target.value)}  />
                    </Col>
                </Row>

                <Row className="text-center my-3">
                    <Col>
                        <button onClick={() => openModal("aprobar")} className="btn-approve me-3">
                            <img src={checkImg} alt="" /> Aprobar
                        </button>
                        <button onClick={() => openModal("denegar")} className="btn-deny me-3">
                            <img src={closeImg} alt="" /> Denegar
                        </button>
                        <button onClick={() => onBack()} className="btn-back">
                            <FaStepBackward/> Atrás
                        </button>
                    </Col>
                </Row>
            </div>

            {/* MODAL */}
            <PaymentsConfirmationModal
                show={showModal}
                variant={modalAction === "denegar" ? "deny" : "approve"}
                title={modalAction === "denegar" ? "Confirmar denegación" : "Confirmar aprobación"}
                message={
                    modalAction === "denegar"
                        ? "Seleccione el rol encargado de subsanar y confirme la denegación."
                        : "¿Desea aprobar esta entrega?"
                }
                confirmLabel={modalAction === "denegar" ? "Denegar" : "Aprobar"}
                cancelLabel="Cancelar"
                rolesOptions={denyDestinationOptions}
                selectedRole={selectedRole}
                onChangeRole={setSelectedRole}
                onConfirm={handleConfirmModal}
                onClose={handleCloseModal}
                confirmDisabled={modalAction === "denegar" && !selectedRole}
            />

            {/* Modal Historicos */}
            <PlanHistory
                show={showModalPlanHistory}
                handleClose={handleCloseModal}
                data={planHistoryData}
            />
        </>
    )
}
import {useEffect, useMemo, useState} from "react";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import { Form, Col, Row } from "react-bootstrap";
import { FaStepBackward } from "react-icons/fa";

//Components
import { UserInformation } from "../../../../shared/user_information/UserInformation";
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
import { PaymentsConfirmationModal } from "../../../../shared/Modals/PaymentsConfirmationModal";

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
import { ResponseStatusEnum, RolesEnum } from "../../../../../../helpers/GlobalEnum";

export const ReviewDocuments = () => {
    const { userAuth } = useOutletContext();

    const params = useParams();
    const navigate = useNavigate();

    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [beneficiaryInformation, setBeneficiaryInformation] = useState({});
    const [showModal, setShowModal] = useState(false);

    const [modalAction, setModalAction] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    const getBeneficiaryInformation = async (deliberyId) => {
        setLoading(true);
        try {
            setInformationLoadingText("Obteniendo información");
            const {data, status} = await paymentServices.getReviewApprovedDeliveriesById(deliberyId);
            if(status === ResponseStatusEnum.OK) {
                setBeneficiaryInformation(data);
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

    const openModal = (action) => {
        setModalAction(action);
        setShowModal(true);
        if (action === "aprobar") {
            setSelectedRole(null);
        }
    };

    const handleConfirmModal = async () => {
        if (modalAction === "denegar") {
            if (!selectedRole) {
                AlertComponent.warning("Seleccione el rol encargado de subsanar.");
                return;
            }
            await approveAndDeny("denegar", selectedRole);
        } else if (modalAction === "aprobar") {
            await approveAndDeny("aprobar");
        }

        handleCloseModal();
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalAction(null);
        setSelectedRole(null);
    };

    const approveAndDeny = async (accion, rolDestinoId = null) => {
        if (accion === 'denegar' && !comments.trim()) {
            AlertComponent.warning("Debe escribir una observación para denegar la entrega.");
            setLoading(false);
            return;
        }

        setLoading(true);

        const payload = {
            aprobado: accion === "aprobar" ? 1 : 0,
            observacion:
                accion === "aprobar" ? "La entrega cumple con todos los requisitos." : comments,
            ...(accion === "denegar" && rolDestinoId
                ? { rol_destino: rolDestinoId }
                : {}),
        };

        try {
            setInformationLoadingText("Guardando");
            const {data, status} = await paymentServices.approveOrDenyPayments(payload, params.id, accion);
            if(status === ResponseStatusEnum.OK) {
                AlertComponent.success('', `${accion} exitosamente!`);
                navigate(`/admin/payments/${params.role}`);
            }
        } catch (error) {
            console.error("Error al aprobar o denegar:", error);
        } finally {
            setLoading(false);
        }
    };

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

    const denyDestinationOptions = useMemo(
        () => getDenyDestinationOptions(userAuth?.rol_id, RolesEnum),
        [userAuth?.rol_id]
    );

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

                <Row className="review-section">
                    <Col md={6} xs={12} className="observations-history">
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

                    <Col md={5} xs={12} className="documents-download">
                        <h5 className="section-title mb-4">Documentos adjuntos</h5>
                        {
                            [RolesEnum.ADMIN, RolesEnum.SUPERVISION].includes(userAuth.rol_id) && (
                                <>
                                    {beneficiaryInformation?.archivos?.orden_compra?.url_descarga && (
                                        <button className="button-download" onClick={() => handleViewFile(beneficiaryInformation?.archivos?.orden_compra)}>
                                            <img src={downloadImg} alt="" /> Plan de inversión
                                        </button>
                                    )}
                                    {beneficiaryInformation?.archivos?.acta_entrega?.url_descarga && (
                                        <button className="button-download" onClick={() => handleViewFile(beneficiaryInformation?.archivos?.acta_entrega)}>
                                            <img src={downloadImg} alt="" /> Acta de entrega
                                        </button>
                                    )}
                                    {beneficiaryInformation?.archivos?.factura_electronica?.url_descarga && (
                                        <button className="button-download" onClick={() => handleViewFile(beneficiaryInformation?.archivos?.factura_electronica)}>
                                            <img src={downloadImg} alt="" /> FE Ó Documento Equivalente
                                        </button>
                                    )}
                                    {beneficiaryInformation?.archivos?.evidencia1?.url_descarga && (
                                        <button className="button-download" onClick={() => handleViewFile(beneficiaryInformation?.archivos?.evidencia1)}>
                                            <img src={downloadImg} alt="" /> Evidencia 1
                                        </button>
                                    )}
                                    {beneficiaryInformation?.archivos?.evidencia2?.url_descarga && (
                                        <button className="button-download" onClick={() => handleViewFile(beneficiaryInformation?.archivos?.evidencia2)}>
                                            <img src={downloadImg} alt="" /> Evidencia 2
                                        </button>
                                    )}
                                </>
                            )
                        }
                        {
                            [RolesEnum.ADMIN, RolesEnum.PAYMENTS, RolesEnum.TRUST_PAYMENTS].includes(userAuth.rol_id) && (
                                <>
                                    {beneficiaryInformation?.archivos?.acta_entrega?.url_descarga && (
                                        <button className="button-download" onClick={() => handleViewFile(beneficiaryInformation?.archivos?.acta_entrega)}>
                                            <img src={downloadImg} alt="" /> Acta de entrega
                                        </button>
                                    )}
                                    {beneficiaryInformation?.archivos?.factura_electronica?.url_descarga && (
                                        <button className="button-download" onClick={() => handleViewFile(beneficiaryInformation?.archivos?.factura_electronica)}>
                                            <img src={downloadImg} alt="" /> FE Ó Documento Equivalente
                                        </button>
                                    )}
                                </>
                            )
                        }
                        <div className="total">
                            Total: <strong>$ {parseFloat(beneficiaryInformation?.valor).toLocaleString('es-CO', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}</strong>
                        </div>
                    </Col>
                </Row>

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
        </>
    )
}
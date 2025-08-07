import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Col, Row } from "react-bootstrap";
import { FaStepBackward } from "react-icons/fa";

//Components
import { UserInformation } from "../../../../shared/user_information/UserInformation";
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";

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
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";

export const ReviewDocuments = () => {

    const params = useParams();
    const navigate = useNavigate();

    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [beneficiaryInformation, setBeneficiaryInformation] = useState({});

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

            const { blob, status } = await filesServices.downloadFile(pdfUrl?.url_descarga);

            if (status === ResponseStatusEnum.OK && blob) {
                const file = new Blob([blob], { type: "application/pdf" });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, '_blank');
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

    const approveAndDeny = async (accion) => {
        if (accion === 'denegar' && !comments.trim()) {
            AlertComponent.warning("Debe escribir una observación para denegar la entrega.");
            setLoading(false);
            return;
        }

        setLoading(true);

        const payload = {
            aprobado: accion === 'aprobar',
            observacion: accion === 'aprobar'
                ? "La entrega cumple con todos los requisitos."
                : comments
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

    const onBack = () => {
        navigate(`/admin/payments/${params.role}`);
    }

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
                        {beneficiaryInformation?.archivos?.plan_inversion?.url_descarga && (
                            <button className="button-download" onClick={() => handleViewFile(beneficiaryInformation?.archivos?.plan_inversion)}>
                                <img src={downloadImg} alt="" /> Plan de inversión
                            </button>
                        )}
                        {beneficiaryInformation?.archivos?.orden_compra?.url_descarga && (
                            <button className="button-download" onClick={() => handleViewFile(beneficiaryInformation?.archivos?.orden_compra)}>
                                <img src={downloadImg} alt="" /> Orden de compra
                            </button>
                        )}
                        {beneficiaryInformation?.archivos?.acta_entrega?.url_descarga && (
                            <button className="button-download" onClick={() => handleViewFile(beneficiaryInformation?.archivos?.acta_entrega)}>
                                <img src={downloadImg} alt="" /> Acta de entrega
                            </button>
                        )}

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
                        <button onClick={() => approveAndDeny('aprobar')} className="btn-approve me-3">
                            <img src={checkImg} alt=""/> Aprobar
                        </button>
                        <button onClick={() => approveAndDeny('denegar')} className="btn-deny me-3">
                            <img src={closeImg} alt=""/> Denegar
                        </button>
                        <button onClick={() => onBack()} className="btn-back">
                            <FaStepBackward/>  Atrás
                        </button>
                    </Col>
                </Row>
            </div>
        </>
    )
}
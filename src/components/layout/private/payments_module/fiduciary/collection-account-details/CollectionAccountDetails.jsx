import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";

// Img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import downloadImg from "../../../../../../assets/image/payments/download.png";

// Components
import { ModernBanner } from "../../../../../shared/ModernBanner";
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";

// Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";
import { filesServices } from "../../../../../../helpers/services/FilesServices";

// Enums
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";

export const CollectionAccountDetails = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [accountInformation, setAccountInformation] = useState(null);

    const getAccountInformaction = async (accountId) => {
        setLoading(true);
        try {
            setInformationLoadingText("Obteniendo información");
            const { data, status } = await paymentServices.getCollectionAccountsById(accountId);
            if (status === ResponseStatusEnum.OK) {
                setAccountInformation(data);
            }
        } catch (error) {
            console.error("Error obteniendo las entregas:", error);
            AlertComponent.error("Error cargando información");
        } finally {
            setLoading(false);
        }
    };

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
            } else if (status === ResponseStatusEnum.NOT_FOUND) {
                AlertComponent.error('Error', 'No se puede descargar el archivo.');
            }
        } catch (error) {
            console.error("Error al descargar archivo:", error);
            AlertComponent.error("Error descargando archivo");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateDocument = async () => {
        setLoading(true);
        try {
            setInformationLoadingText("Generando documento");
            // Add actual document generation logic here
            AlertComponent.info("Funcionalidad en desarrollo");
        } catch (error) {
            console.error("Error al Generar documento PDF para cuenta:", error);
            AlertComponent.error("Error generando documento");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            getAccountInformaction(params.id);
        }
    }, [params.id]);

    return (
        <>
            <ModernBanner
                imageHeader={imgPayments}
                titleHeader="Detalle cuenta de cobro"
                bannerIcon={imgAdd}
                backgroundIconColor="#2148C0"
                bannerInformation="Aquí podrás revisar el detalle de la cuenta de cobro enviada por el proveedor."
                backgroundInformationColor="#40A581"
            />

            {loading && (
                <div className="overlay">
                    <div className="loader">
                        <Spinner animation="border" variant="success" />
                        <div className="spinner-text">{informationLoadingText}</div>
                    </div>
                </div>
            )}

            <div className="page-content">
                {accountInformation && (
                    <div className="form-container">
                        <Row className="mb-4">
                            <Col md={5}>
                                <div className="info-section">
                                    <h5 className="section-title">Proveedor</h5>
                                    <div className="info-item">
                                        <strong>Nombre:</strong> {accountInformation?.proveedor.nombre}
                                    </div>
                                    <div className="info-item">
                                        <strong>NIT:</strong> {accountInformation?.proveedor.nit}
                                    </div>
                                    <div className="info-item">
                                        <strong>Cuenta N°:</strong> {accountInformation?.cuenta_cobro.numero}
                                    </div>
                                </div>
                            </Col>

                            <Col md={3}>
                                <div className="info-section">
                                    <h5 className="section-title">Cuenta bancaria</h5>
                                    <div className="info-item">
                                        <strong>Entidad:</strong> {accountInformation?.banco?.entidad_bancaria}
                                    </div>
                                    <div className="info-item">
                                        <strong>Número:</strong> {accountInformation?.banco?.numero_cuenta}
                                    </div>
                                </div>
                            </Col>

                            <Col md={4}>
                                <div className="total-section">
                                    <div className="total-amount">
                                        Total: <strong>$ {parseFloat(accountInformation?.cuenta_cobro.valor_total).toLocaleString('es-CO')}</strong>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-4">
                            <Col md={6}>
                                <div className="documents-section">
                                    <h5 className="section-title">Documentos adjuntos</h5>
                                    <div className="documents-list">
                                        <button 
                                            className="btn btn-outline-primary d-flex align-items-center gap-2 mb-2" 
                                            onClick={() => handleViewFile(accountInformation?.archivos.solicitud_cuenta)}
                                        >
                                            <img src={downloadImg} alt="" width="16" height="16" /> 
                                            Solicitud cuenta
                                        </button>
                                        <button 
                                            className="btn btn-outline-primary d-flex align-items-center gap-2 mb-2" 
                                            onClick={() => handleViewFile(accountInformation?.archivos.certificado_bancario)}
                                        >
                                            <img src={downloadImg} alt="" width="16" height="16" /> 
                                            Certificado bancario
                                        </button>
                                        <button 
                                            className="btn btn-outline-primary d-flex align-items-center gap-2 mb-2" 
                                            onClick={() => handleViewFile(accountInformation?.archivos.rut)}
                                        >
                                            <img src={downloadImg} alt="" width="16" height="16" /> 
                                            RUT
                                        </button>
                                    </div>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="deliveries-section">
                                    <h5 className="section-title">Entregas</h5>
                                    <div className="deliveries-list">
                                        {accountInformation?.detalles.map((item, idx) => (
                                            <div key={idx} className="delivery-item">
                                                <div className="delivery-info">
                                                    <strong>Fecha:</strong> {new Date(item.fcrea).toLocaleDateString()} 
                                                    <strong className="ms-3">CUB:</strong> {item?.entrega?.cub} 
                                                    <strong className="ms-3">Valor:</strong> $ {parseFloat(item.valor).toLocaleString('es-CO')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center mt-4">
                            <Col xs="12" md="6" lg="4" className="d-flex justify-content-center mb-3 mb-md-0">
                                <Button 
                                    variant="outline-secondary" 
                                    className="d-flex align-items-center gap-2"
                                    onClick={() => navigate(-1)}
                                >
                                    <BsArrowLeft size={18} /> Cuentas de cobro
                                </Button>
                            </Col>
                            <Col xs="12" md="6" lg="4" className="d-flex justify-content-center">
                                <Button 
                                    variant="outline-danger" 
                                    onClick={handleGenerateDocument}
                                    disabled={loading}
                                >
                                    📝 Generar documento
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )}
            </div>
        </>
    );
};

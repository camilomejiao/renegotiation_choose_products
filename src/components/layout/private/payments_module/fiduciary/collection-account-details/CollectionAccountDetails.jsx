import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { FaStepBackward } from "react-icons/fa";

// Img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import downloadImg from "../../../../../../assets/image/payments/download.png";

// Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";

// Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";
import { filesServices } from "../../../../../../helpers/services/FilesServices";

// Enums
import { ReportTypePaymentsEnum, ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";

// CSS
import './CollectionAccountDetails.css';

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
        } finally {
            setLoading(false);
        }
    };

    const handleViewFile = async (pdfUrl) => {
        if (!pdfUrl) {
            AlertComponent.error('Error', 'No hay un archivo cargado para esta entrega.');
            return;
        }

        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateDocument = async (SPId, reportType) => {
        try {
            setLoading(true);
            setInformationLoadingText("Generando documento");

            const { status, blob, type, filename, data } = await paymentServices.getExcelAndPdfFile(SPId, reportType);
            console.log(blob, status);

            if (status === ResponseStatusEnum.OK && blob) {
                const fileURL = URL.createObjectURL(blob);
                // Si es PDF y quieres abrir en otra pestaña:
                if ((type).includes('pdf')) {
                    window.open(fileURL, '_blank');
                } else {
                    // Descarga (Excel u otros binarios)
                    const a = document.createElement('a');
                    a.href = fileURL;
                    a.download = filename || 'reporte.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }

                // Limpia el ObjectURL
                setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
            } else if (status === ResponseStatusEnum.NOT_FOUND || !blob) {
                AlertComponent.error('Error', 'No se puede descargar el archivo.');
            }
        } catch (error) {
            console.error("Error al Generar documento PDF para cuenta:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStatusAccount = async (SPId) => {
        try {
            setLoading(true);
            setInformationLoadingText("Validando entregas y pago");
            const {data, status} = await paymentServices.changeStatusCollectionAccountDetail(SPId);
            console.log(data);
            if (status === ResponseStatusEnum.OK) {
                AlertComponent.success(data.mensaje);
                navigate(`/admin/fiduciary/list-account-suppliers`);
            }

            if (status === ResponseStatusEnum.BAD_REQUEST) {
                AlertComponent.error(data.detail);
            }
        } catch (error) {
            console.error("Error obteniendo las entregas:", error);
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
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Detalle cuenta de cobro'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás revisar el detalle de la cuenta de cobro enviada por el proveedor.'}
                backgroundInformationColor={'#40A581'}
            />

            {loading && (
                <div className="overlay">
                    <div className="loader">{informationLoadingText}</div>
                </div>
            )}

            {accountInformation && (
                <div className="content-collection-details">
                    <Row className="mb-4">
                        <Col md={5}>
                            <h5 className="section-title">Proveedor</h5>
                            <div><strong>Nombre:</strong> {accountInformation?.proveedor.nombre}</div>
                            <div><strong>NIT:</strong> {accountInformation?.proveedor.nit}</div>
                            <div><strong>Cuenta N°:</strong> {accountInformation?.cuenta_cobro.numero}</div>
                        </Col>

                        <Col md={3}>
                            <h5 className="section-title">Cuenta bancaria</h5>
                            <div><strong>Entidad:</strong> {accountInformation?.banco?.entidad_bancaria}</div>
                            <div><strong>Número:</strong> {accountInformation?.banco?.numero_cuenta}</div>
                        </Col>

                        <Col md={4}>
                            <div className="total">
                                Total: <strong>$ {parseFloat(accountInformation?.cuenta_cobro.valor_total).toLocaleString('es-CO')}</strong>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md={6}>
                            <h5 className="section-title">Documentos adjuntos</h5>
                            <button className="button-download-collection" onClick={() => handleViewFile(accountInformation?.archivos.certificado_bancario)}>
                                <img src={downloadImg} alt="" /> Certificado bancario
                            </button>
                            <button className="button-download-collection" onClick={() => handleViewFile(accountInformation?.archivos.rut)}>
                                <img src={downloadImg} alt="" /> RUT
                            </button>
                            <button className="button-generate" onClick={() => handleGenerateDocument(accountInformation?.cuenta_cobro.numero, ReportTypePaymentsEnum.EXCEL)}>
                                <img src={downloadImg} alt="" /> Generar documento excel
                            </button>
                            <button className="button-generate" onClick={() => handleGenerateDocument(accountInformation?.cuenta_cobro.numero, ReportTypePaymentsEnum.PDF)}>
                                <img src={downloadImg} alt="" /> Generar documento pdf
                            </button>
                        </Col>

                        <Col md={6}>
                            <h5 className="section-title">Entregas</h5>
                            {accountInformation?.detalles.map((item, idx) => (
                                <div key={idx} className="revision-box">
                                    <div><strong>Fecha:</strong> {new Date(item.fcrea).toLocaleDateString()} <strong>CUB:</strong> {item?.entrega?.cub} <strong>Valor:</strong> $ {parseFloat(item.valor).toLocaleString('es-CO')}</div>
                                </div>
                            ))}
                        </Col>
                    </Row>

                    <Row className="justify-content-center mt-4">
                        <Col xs="12" md="6" lg="4" className="d-flex justify-content-center">
                            <Button className="generate" variant="outline-warning" onClick={() => handleChangeStatusAccount(accountInformation?.cuenta_cobro?.id)}>
                                Emitir para pago
                            </Button>
                        </Col>
                        <Col xs="12" md="6" lg="4" className="d-flex justify-content-center mb-3 mb-md-0">
                            <button className="button-back" onClick={() => navigate(-1)}>
                                <FaStepBackward /> Cuentas de cobro
                            </button>
                        </Col>
                    </Row>
                </div>
            )}
        </>
    );
};

import { useEffect, useState } from "react";
import { Form, Col, Row } from "react-bootstrap";
import { FaStepBackward } from "react-icons/fa";

//Components
import { UserInformation } from "../../../user_information/UserInformation";

//helper
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";

//Img
import downloadImg from "../../../../../../assets/image/payments/download.png";
import checkImg from "../../../../../../assets/image/payments/check.png";
import closeImg from "../../../../../../assets/image/payments/close.png";

//Css
import './ReviewDocuments.css';

//Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";

//Enum
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";
import { useNavigate, useParams } from "react-router-dom";

export const ReviewDocuments = () => {

    const params = useParams();
    const navigate = useNavigate();

    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [beneficiaryInformation, setBeneficiaryInformation] = useState({});

    const getBeneficiaryInformation = async (cubId) => {
        setLoading(true);
        try {
            setInformationLoadingText("Obteniendo información");
            const {data, status} = await paymentServices.getReviewApprovedDeliveriesById(cubId);
            console.log(data);
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
            AlertComponent.error('Error', 'No hay un archivo cargado para este producto.');
            return;
        }
        setLoading(true);
        try {
            setInformationLoadingText("Obteniendo archivo");
            const {blob, status} = await paymentServices.downloadFile(pdfUrl?.id);
            if(status === ResponseStatusEnum.OK) {
                const blobUrl = window.URL.createObjectURL(blob);
                window.open(blobUrl, '_blank');
            }

            if(status === ResponseStatusEnum.NOT_FOUND) {
                AlertComponent.error('Error', 'No se puede descargar el archivo.');
            }
        } catch (error) {
            console.error("Error al aprobar o denegar:", error);
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
            console.log(data);
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
            <div className="content-review-documents">

                {!loading && beneficiaryInformation?.beneficiario && (
                    <UserInformation userData={beneficiaryInformation.beneficiario} />
                )}

                {loading && (
                    <div className="overlay">
                        <div className="loader">{informationLoadingText}</div>
                    </div>
                )}

                <Row className="button-group-review mt-5">
                    <button
                        className="button-download"
                        onClick={() => handleViewFile(beneficiaryInformation?.archivos?.pdf)}
                    >
                        <img src={downloadImg} alt=""/> Plan de inversión
                    </button>
                    <button
                        className="button-download"
                        onClick={() => handleViewFile(beneficiaryInformation?.archivos?.pdf)}
                    >
                        <img src={downloadImg} alt=""/> Orden de compra
                    </button>
                    <button className="button-download"
                            onClick={() => handleViewFile(beneficiaryInformation?.archivos?.acta_de_entrega)}
                    >
                        <img src={downloadImg} alt=""/> Acta de entrega
                    </button>
                    <div className="total">
                        Total: <strong> $ {parseFloat(beneficiaryInformation?.valor).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
                    </div>
                </Row>

                <Row className="observations mt-5 my-3">
                    <Col>
                        <Form.Label><img src={closeImg} alt=""/> Observaciones</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comments}
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
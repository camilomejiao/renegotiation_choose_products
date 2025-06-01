import { useEffect, useState } from "react";
import { Form, Col, Row } from "react-bootstrap";
import { FaStepBackward } from "react-icons/fa";

//Components
import { UserInformation } from "../../../user_information/UserInformation";

//Img
import downloadImg from "../../../../../../assets/image/payments/download.png";
import checkImg from "../../../../../../assets/image/payments/check.png";
import closeImg from "../../../../../../assets/image/payments/close.png";

//Css
import './ReviewDocuments.css';

export const ReviewDocuments = ({ cubId, onBack }) => {

    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");

    const getBeneficiaryInformation = () => {
        //setLoading(true);
        //setInformationLoadingText("Obteniendo informacion del usuario")
        try {

        } catch (error) {

        } finally {
            //setLoading(true);
        }
    }

    const approveAndDeny = () => {
        console.log("Comentarios guardados:", comments);
        //setLoading(true);
        //setInformationLoadingText("Guardando")
        try {

        } catch (error) {

        } finally {
            //setLoading(true);
        }
    };

    useEffect(() => {
        if(cubId) {
            getBeneficiaryInformation();
        }
    }, [cubId]);

    return (
        <>
            <div className="content-review-documents">

                <UserInformation userData={''} />

                {loading && (
                    <div className="overlay">
                        <div className="loader">{informationLoadingText}</div>
                    </div>
                )}

                <Row className="button-group-review mt-5">
                    <button className="button-download">
                        <img src={downloadImg} alt=""/> Documentación
                    </button>
                    <button className="button-download">
                        <img src={downloadImg} alt=""/> Acta de entrega
                    </button>
                    <div className="total">Total: <strong>$350.000</strong></div>
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
                        <button onClick={() => approveAndDeny()} className="btn-approve me-3">
                            <img src={checkImg} alt=""/> Aprobar
                        </button>
                        <button onClick={() => approveAndDeny()} className="btn-deny me-3">
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
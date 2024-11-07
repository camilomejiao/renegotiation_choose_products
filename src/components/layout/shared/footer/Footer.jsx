import {Col, Row} from "react-bootstrap";
import imgFooter from "../../../../assets/image/footer/footer.png";

export const Footer = () => {

    return(
        <>
            <Row className="footer-image-container mt-5">
                <Col>
                    <img src={imgFooter} alt="Footer" className="footer-image" style={{ width: '95%'}}/>
                </Col>
            </Row>
        </>
    )
}
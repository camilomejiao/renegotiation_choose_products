import {Col, Row} from "react-bootstrap";

//Img
import imgFooter from "../../../../assets/image/footer/footer.png";

//Css
import './Footer.css';

export const Footer = () => {

    return(
        <>
            <Row className="footer-image-container mt-5">
                <Col>
                    <img src={imgFooter} alt="Footer" className="footer-image" />
                </Col>
            </Row>
        </>
    )
}
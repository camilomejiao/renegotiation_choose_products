import {Col, Row} from "react-bootstrap";

import './HeaderImage.css';

export const HeaderImage = ({imageHeader, titleHeader, bannerIcon, bannerInformation }) => {

    return(
        <>
            {/* Encabezado con la imagen de fondo y el título */}
            <div className="header-image position-relative">
                <img src={imageHeader} alt="Fondo" className="background-image w-100" />
                <div className="overlay-text position-absolute w-100 text-center">
                    <h1>{titleHeader}</h1>
                </div>
            </div>

            {/* Contenedor de la información del usuario */}
            <div className="user-info-container">
                <Row className="position-relative">
                    <Col className="d-flex justify-content-center">
                        {/* Icono separado del banner */}
                        <div className="icon-wrapper position-absolute"
                             /*style={{ top: '-90px', left: '330px' }}*/
                        >
                            <img src={bannerIcon} alt="Icono" className="icon-large" />
                        </div>
                        {/* Banner de información */}
                        <div className="small-banner d-flex align-items-center text-white text-center p-2">
                            <p className="mb-0 ms-5">{bannerInformation}</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}
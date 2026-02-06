import { Col, Row } from "react-bootstrap";


export const HeaderImage = ({ imageHeader, titleHeader, bannerIcon, backgroundIconColor, bannerInformation, backgroundInformationColor }) => {

    return (
        <>
            {/* Encabezado con la imagen de fondo y el título */}
            <div className="header-image position-relative">
                <img src={imageHeader} className="background-image w-100" alt="Fondo" />
                <div className="overlay-text position-absolute w-100 text-center">
                    <h1 className="title-header">{titleHeader}</h1>
                </div>
            </div>

            {bannerIcon && bannerInformation && (
                <>
                    {/* Contenedor de la información del usuario */}
                    <div className="user-info-container">
                        <Row className="position-relative">
                            <Col className="d-flex justify-content-center">
                                {/* Icono separado del banner */}
                                <div style={{backgroundColor: backgroundIconColor}}
                                    className="icon-wrapper position-absolute"
                                >
                                    <img src={bannerIcon} className="icon-large" alt="Icono" />
                                </div>
                                {/* Banner de información */}
                                <div style={{backgroundColor: backgroundInformationColor }}
                                     className="small-banner d-flex align-items-center text-white text-center p-2">
                                    <p className="mb-0 ms-5">{bannerInformation}</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </>
            )}
        </>
    );
};

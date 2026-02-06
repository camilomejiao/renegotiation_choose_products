import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

export const ModernBanner = ({
  imageHeader,
  titleHeader,
  bannerIcon,
  backgroundIconColor = "#2148C0",
  bannerInformation,
  backgroundInformationColor = "#F66D1F",
  infoText,
}) => {
  return (
    <>
      {/* Header Image */}
      <div className="header-image position-relative">
        <img src={imageHeader} className="background-image w-100" alt="Fondo" />
        <div className="overlay-text position-absolute w-100 text-center">
          <h1 className="title-header">{titleHeader}</h1>
        </div>
      </div>

      {/* User Info Container */}
      {bannerIcon && bannerInformation && (
        <div className="user-info-container">
          <Row className="position-relative">
            <Col className="d-flex justify-content-center">
              <div
                style={{ backgroundColor: backgroundIconColor }}
                className="icon-wrapper position-absolute"
              >
                <img src={bannerIcon} className="icon-large" alt="Icono" />
              </div>
              <div
                style={{ backgroundColor: backgroundInformationColor }}
                className="small-banner d-flex align-items-center text-white text-center p-2"
              >
                <p className="mb-0 ms-5">{bannerInformation}</p>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* Info Banner */}
      {infoText && (
        <div className="info-banner">
          <div className="info-content">
            <div className="info-title">Información importante</div>
            <p className="info-text">{infoText}</p>
          </div>
        </div>
      )}
    </>
  );
};

ModernBanner.propTypes = {
  imageHeader: PropTypes.string.isRequired,
  titleHeader: PropTypes.string.isRequired,
  bannerIcon: PropTypes.string,
  backgroundIconColor: PropTypes.string,
  bannerInformation: PropTypes.string,
  backgroundInformationColor: PropTypes.string,
  infoText: PropTypes.string,
};

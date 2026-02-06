import { Col, Container, Row } from "react-bootstrap";
import { FaBriefcase, FaIdCard, FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";

//Img
import imgAdd from "../../../../assets/image/addProducts/imgAdd.png";

export const UserInformation = ({userData}) => {

    return (
        <>
            <div className="user-info-container user-info--panel">
                <Container>
                    <div className="user-info-panel__title">
                        <FaUserCircle className="user-info-panel__icon" />
                        Información del Beneficiario
                    </div>

                    <div className="user-info-panel__summary">
                        <div className="user-info-panel__summary-left">
                            <div className="user-info-panel__avatar">
                                <img src={imgAdd} alt="Icono Usuario" />
                            </div>
                            <div className="user-info-panel__identity">
                                <h3>{userData?.nombre} {userData?.apellido}</h3>
                                <div className="user-info-panel__ids">
                                    <span><strong>C.C:</strong> {userData?.identificacion}</span>
                                    <span><strong>CUB:</strong> {userData?.cub_id}</span>
                                </div>
                            </div>
                        </div>
                        <div className="user-info-panel__status">
                            <span className="status-chip">Activo</span>
                        </div>
                    </div>

                    <Row className="user-info-panel__cards g-3">
                        <Col xs={12} lg={4}>
                            <div className="user-info-card">
                                <div className="user-info-card__header">
                                    <span className="user-info-card__icon user-info-card__icon--location">
                                        <FaMapMarkerAlt />
                                    </span>
                                    Ubicación
                                </div>
                                <div className="user-info-card__body">
                                    <div><strong>Departamento:</strong> {userData?.departamento}</div>
                                    <div><strong>Municipio:</strong> {userData?.municipio}</div>
                                    <div><strong>Vereda:</strong> {userData?.vereda}</div>
                                </div>
                            </div>
                        </Col>

                        <Col xs={12} lg={4}>
                            <div className="user-info-card">
                                <div className="user-info-card__header">
                                    <span className="user-info-card__icon user-info-card__icon--work">
                                        <FaBriefcase />
                                    </span>
                                    Información Laboral
                                </div>
                                <div className="user-info-card__body">
                                    <div><strong>Actividad:</strong> {userData?.actividad}</div>
                                    <div><strong>Línea Productiva:</strong> {userData?.linea}</div>
                                    <div><strong>Plan:</strong> {userData?.plan}</div>
                                </div>
                            </div>
                        </Col>

                        <Col xs={12} lg={4}>
                            <div className="user-info-card">
                                <div className="user-info-card__header">
                                    <span className="user-info-card__icon user-info-card__icon--personal">
                                        <FaIdCard />
                                    </span>
                                    Información Personal
                                </div>
                                <div className="user-info-card__body">
                                    <div><strong>Teléfono:</strong> {userData?.telefono}</div>
                                    <div><strong>Etnia:</strong> {userData?.etnico}</div>
                                    <div><strong>Observaciones:</strong> {userData?.restriccion}</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

        </>
    )
}

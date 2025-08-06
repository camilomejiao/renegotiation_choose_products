import { Col, Container, Row } from "react-bootstrap";

//Img
import imgAdd from "../../../../assets/image/addProducts/imgAdd.png";

//Css
import './UserInformation.css';

export const UserInformation = ({userData}) => {

    return (
        <>
            <div className="user-info-container">
                <Container>
                    <Row className="align-items-center">
                        <Col xs={12} className="d-flex justify-content-center mb-2">
                            <img src={imgAdd} alt="Icono Usuario" className="user-icon" />
                            <div className="user-name-container">
                                <div className="user-name">
                                    <span><strong>NOMBRE: </strong></span>{userData?.nombre} {userData?.apellido}
                                </div>
                                <div className="user-id">
                                    <strong>C.C:</strong> {userData?.identificacion}
                                    <span className="ms-3"><strong>CUB:</strong> {userData?.cub_id}</span>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} className="user-details mt-5">
                            <Row className="gx-0 gy-3 px-2">
                                {/* Ubicación */}
                                <div className="col-md-6 col-lg-4 px-2">
                                    <div className="user-detail-item bg-card">
                                        <span className="label">Departamento</span>
                                        <div className="value">{userData?.departamento}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4 px-2">
                                    <div className="user-detail-item bg-card">
                                        <span className="label">Municipio</span>
                                        <div className="value">{userData?.municipio}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4 px-2">
                                    <div className="user-detail-item bg-card">
                                        <span className="label">Vereda</span>
                                        <div className="value">{userData?.vereda}</div>
                                    </div>
                                </div>

                                {/* Información del CUB */}
                                <div className="col-md-6 col-lg-4 px-2">
                                    <div className="user-detail-item bg-card">
                                        <span className="label">Estado</span>
                                        <div className="value">{userData?.estado_cub}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4 px-2">
                                    <div className="user-detail-item bg-card">
                                        <span className="label">Actividad</span>
                                        <div className="value">{userData?.actividad}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4 px-2">
                                    <div className="user-detail-item bg-card">
                                        <span className="label">Tipo de persona</span>
                                        <div className="value">{userData?.tipo}</div>
                                    </div>
                                </div>

                                {/* Contacto */}
                                <div className="col-md-6 col-lg-4 px-2">
                                    <div className="user-detail-item bg-card">
                                        <span className="label">Teléfono</span>
                                        <div className="value">{userData?.telefono}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4 px-2">
                                    <div className="user-detail-item bg-card">
                                        <span className="label">Plan</span>
                                        <div className="value">{userData?.plan}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4 px-2">
                                    <div className="user-detail-item bg-card">
                                        <span className="label">Línea</span>
                                        <div className="value">{userData?.linea}</div>
                                    </div>
                                </div>

                                {/* Otros */}
                                <div className="col-md-6 col-lg-4 px-2">
                                    <div className="user-detail-item bg-card">
                                        <span className="label">Restricción</span>
                                        <div className="value">{userData?.restriccion}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4 px-2">
                                    <div className="user-detail-item bg-card">
                                        <span className="label">Etnia</span>
                                        <div className="value">{userData?.etnico}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4 px-2">
                                    <div className="user-detail-item bg-card">
                                        <span className="label">Observaciones</span>
                                        <div className="value">{userData?.restriccion}</div>
                                    </div>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>

        </>
    )
}
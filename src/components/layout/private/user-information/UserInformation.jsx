import {Col, Container, Row} from "react-bootstrap";
import imgAdd from "../../../../assets/image/addProducts/imgAdd.png";
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
                                    {userData.nombre} {userData.apellido}
                                </div>
                                <div className="user-id">
                                    <strong>C.C:</strong> {userData.identificacion}
                                    <span className="ms-3"><strong>CUB:</strong> {userData.id}</span>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} className="user-details mt-5">
                            <Row>
                                <Col md={6} lg={4} className="user-detail-item"><strong>Departamento:</strong> {userData.departamento}</Col>
                                <Col md={6} lg={4} className="user-detail-item"><strong>Municipio:</strong> {userData.municipio}</Col>
                                <Col md={6} lg={4} className="user-detail-item"><strong>Vereda:</strong> {userData.vereda}</Col>
                                <Col md={6} lg={4} className="user-detail-item"><strong>Estado:</strong> {userData.estado_cub}</Col>
                                <Col md={6} lg={4} className="user-detail-item"><strong>Actividad:</strong> {userData?.actividad}</Col>
                                <Col md={6} lg={4} className="user-detail-item"><strong>Tipo de persona:</strong> {userData?.tipo}</Col>
                                <Col md={6} lg={4} className="user-detail-item"><strong>Teléfono:</strong> {userData?.telefono}</Col>
                                <Col md={6} lg={4} className="user-detail-item"><strong>Plan:</strong> {userData?.plan}</Col>
                                <Col md={6} lg={4} className="user-detail-item"><strong>Restricción:</strong> {userData?.restriccion}</Col>
                                <Col md={6} lg={4} className="user-detail-item"><strong>Etnia:</strong> {userData?.etnico}</Col>
                                <Col md={12} lg={8} className="user-detail-item"><strong>Línea:</strong> {userData?.linea}</Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>

        </>
    )
}
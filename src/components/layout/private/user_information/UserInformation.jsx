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
                            <img src={imgAdd} alt="Icono Usuario" className="user-icon" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid #0056b3'}} />
                            <div className="user-name-container">
                                <div className="user-name text-white px-3 py-1 rounded" style={{ backgroundColor: '#BFD732', fontSize: '18px', fontWeight: 'bold' }}>
                                    {userData.nombre} {userData.apellido}
                                </div>
                                <div className="user-id-container d-flex justify-content-center">
                                    <div className="user-id px-2 py-1 rounded" style={{ backgroundColor: '#0056b3', color: 'white', fontSize: '14px' }}>
                                        <strong>C.C:</strong> {userData.identificacion} <span className="ms-3"><strong>CUP:</strong> {userData.id}</span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} className="user-details mt-5">
                            <Row>
                                <Col xs={4}><strong>Municipio:</strong> {userData.municipio}</Col>
                                <Col xs={4}><strong>Actividad:</strong> Actividad</Col>
                                <Col xs={4}><strong>Plan:</strong> {userData.municipio}</Col>
                                <Col xs={4}><strong>Vereda:</strong> {userData.vereda}</Col>
                                <Col xs={4}><strong>Estado:</strong> {userData.estado_cub}</Col>
                                <Col xs={4}><strong>Línea:</strong> Café tradicional, siembra o sostenimiento</Col>
                                <Col xs={4}><strong>Tipo de persona:</strong> Titular</Col>
                                <Col xs={8}><strong>Restricción:</strong> Resguardado 2022</Col>
                                <Col xs={4}><strong>Teléfono:</strong> 3028974444</Col>
                                <Col xs={4}><strong>Etnia:</strong> Resguardo indígena Jambaló</Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}
import { useOutletContext, useParams } from "react-router-dom";
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgAdd from "../../../../assets/image/addProducts/imgAdd.png";
import imgFrame1 from "../../../../assets/image/icons/frame.png";
import imgFrame2 from "../../../../assets/image/icons/Frame1.png";
import { Footer } from "../footer/Footer";
import { UserInformation } from "../user_information/UserInformation";
import {useEffect, useRef, useState} from "react";
import { userService } from "../../../../helpers/services/UserServices";
import { Col, Container, Row } from "react-bootstrap";

//
import './Reports.css';
import {Authorization} from "./Authorization/Authorization";
import printJS from "print-js";


export const Reports = () => {
    const { userAuth } = useOutletContext();
    const params = useParams();

    const [userData, setUserData] = useState({});

    const getUserInformation = async (cubId) => {
        await userService.userInformation(cubId).then((data) => {
            console.log(data)
            setUserData(data);
        });
    }

    const authorizationRef = useRef();

    const handlePrintAuthorization = () => {
        // Agregar los estilos CSS al contenido que se imprimirá
        const printContent = `
        <html>
        <head>
          <style>           
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              font-size: 12px;
            }           
          </style>
        </head>
        <body>
          <!-- Inyectamos el HTML del componente -->
          ${authorizationRef.current.innerHTML} 
        </body>
        </html>`;

        // Usamos printJS con el contenido modificado
        printJS({
            printable: printContent,
            type: 'raw-html',
            documentTitle: 'Autorización Plan de Inversión',
        });
    }

    useEffect(() => {
        if(params.id){
            getUserInformation(params.id);
        }
    }, []);

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgDCSIPeople}
                    titleHeader={'¡Explora el banco de proveedores!'}
                    bannerIcon={imgAdd}
                    bannerInformation={'Conoce los proyectos, compras y proveedores en un solo lugar.'}
                />

                {/* Contenedor de la información del usuario */}
                <UserInformation userData={userData} />

                <div className="search-banner-reports">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={12} className="d-flex justify-content-around">
                                {userAuth.rol_id === 2 && (
                                    <button className="report-button general">
                                        <img src={imgFrame1} alt="icono general" className="button-icon" />
                                        REPORTE GENERAL
                                    </button>
                                )}
                                <button className="report-button unique">
                                    <img src={imgFrame2} alt="icono único" className="button-icon" />
                                    REPORTE POR BENEFICIARIOS
                                </button>
                                {userAuth.rol_id === 2 && (
                                    <button onClick={handlePrintAuthorization} className="report-button general">
                                        <img src={imgFrame1} alt="icono general" className="button-icon" />
                                        AUTORIZACIÓN
                                    </button>
                                )}
                                {/* Aquí renderizas el componente pero lo ocultas */}
                                <div style={{ display: 'none' }}>
                                    <div ref={authorizationRef}>
                                        <Authorization userData={userData} />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Footer />
            </div>
        </>
    )
}
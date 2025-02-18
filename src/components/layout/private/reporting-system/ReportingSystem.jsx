import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import printJS from "print-js";

//img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgAdd from "../../../../assets/image/addProducts/imgAdd.png";
import imgFrame2 from "../../../../assets/image/icons/Frame1.png";

//Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import { UserInformation } from "../user-information/UserInformation";
import { HeadLineReport } from "./user-report/HeadLineReport";

//Services
import { userService } from "../../../../helpers/services/UserServices";
import { reportServices } from "../../../../helpers/services/ReportServices";

//Css
import './ReportingSystem.css';
import {ComponentEnum, ResponseStatusEnum} from "../../../../helpers/GlobalEnum";
import {AuthorizationSection} from "../../shared/authorization-section/AuthorizationSection";

export const ReportingSystem = () => {
    const params = useParams();
    const navigate = useNavigate();

    //
    const headlineReportRef = useRef();

    //
    const [userData, setUserData] = useState({});
    const [headLineInformation, setHeadLineInformation] = useState({});
    const [isReadyToPrintHeadLineInformation, setIsReadyToPrintHeadLineInformation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //Obtiene la información del usuario
    const getUserInformation = async (cubId) => {
        try {
            const { data, status} = await userService.userInformation(cubId);
            if(status === ResponseStatusEnum.OK) {
                setUserData(data);
            }
        } catch (error) {
            console.error("Error obteniendo la informacion del usuario:", error);
        }
    }

    const handleDeliveries = (cubId) => {
        navigate(`/admin/deliveries/${cubId}`)
    }

    //Imprime el reporte de compras del usuario
    const handleHeadlineInformationToReport = async (cubId) => {
        setIsLoading(true);
        try {
            const { data, status} = await reportServices.headlineReport(cubId);
            if(status === ResponseStatusEnum.OK) {
                setHeadLineInformation(data);
                setIsReadyToPrintHeadLineInformation(true);
            }
        } catch (error) {
            console.error("Error obteniendo el reporte:", error);
        } finally {
            setIsLoading(false);
        }
    }

    //pdf de compras del usuario
    const printHeadlineReport = () => {
        const printContent = `
        <html>
        <head>
          <style>           
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              font-size: 10px;
            }           
          </style>
        </head>
        <body>
          <!-- Inyectamos el HTML del componente -->
          ${headlineReportRef.current.innerHTML} 
        </body>
        </html>`;

        printJS({
            printable: printContent,
            type: 'raw-html',
            documentTitle: 'Reporte Titular',
        });
    }

    //Al cargar el componente
    useEffect(() => {
        if(params.id){
            getUserInformation(params.id);
        }
    }, []);

    //Al dar click en el reporte
    useEffect(() => {
        if (isReadyToPrintHeadLineInformation) {
            printHeadlineReport();
            setIsReadyToPrintHeadLineInformation(false); // Restablecer el estado
        }
    }, [isReadyToPrintHeadLineInformation]);

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

                {isLoading && (
                    <div className="spinner-container">
                        <Spinner animation="border" variant="success" />
                        <span>Cargando...</span>
                    </div>
                )}

                <div className="search-banner-reports">
                    <Container>
                        <Row className="justify-content-start">
                            <Col xs={12} md={4} className="d-flex justify-content-center mb-3 mb-md-0">
                                <button onClick={() => handleHeadlineInformationToReport(params.id)} className="reporting-system-button unique">
                                    <img src={imgFrame2} alt="icono único" className="button-icon" />
                                    REPORTE DE COMPRAS POR TITULAR
                                </button>
                            </Col>
                            <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-end">
                                <button onClick={() => handleDeliveries(params.id)} className="reporting-system-button deliveries">
                                    <img src={imgFrame2} alt="icono único" className="button-icon" />
                                    ENTREGAS
                                </button>
                            </Col>
                        </Row>
                    </Container>
                </div>

                {/* Authorization Component */}
                <AuthorizationSection component={ComponentEnum.USER} userData={userData} wide={5} />

                {/* Aquí renderizas el componente pero lo ocultas */}
                <div style={{ display: 'none' }}>
                    {isReadyToPrintHeadLineInformation && (
                        <div ref={headlineReportRef}>
                            <HeadLineReport dataReport={headLineInformation} />
                        </div>
                    )}
                </div>

            </div>
        </>
    )
}
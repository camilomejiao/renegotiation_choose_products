import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import printJS from "print-js";

//img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgAdd from "../../../../assets/image/addProducts/imgAdd.png";
import imgFrame1 from "../../../../assets/image/icons/frame.png";
import imgFrame2 from "../../../../assets/image/icons/Frame1.png";

//Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import { Footer } from "../../shared/footer/Footer";
import { UserInformation } from "../user-information/UserInformation";
import { Authorization } from "./authorization/Authorization";
import { HeadLineReport } from "./user-report/HeadLineReport";

//Services
import { userService } from "../../../../helpers/services/UserServices";
import { reportServices } from "../../../../helpers/services/ReportServices";

//Css
import './ReportingSystem.css';
import {StatusEnum} from "../../../../helpers/GlobalEnum";


export const ReportingSystem = () => {
    const params = useParams();
    const navigate = useNavigate();

    //
    const authorizationRef = useRef();
    const headlineReportRef = useRef();

    //
    const [userData, setUserData] = useState({});
    const [headLineInformation, setHeadLineInformation] = useState({});
    const [isReadyToPrintHeadLineInformation, setIsReadyToPrintHeadLineInformation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');

    const options = [
        ' ',
        'Imposibilidad jurídica',
        'Imposibilidad fáctica',
        'Mayor impacto productivo',
        'Otros componentes no incluidos en el plan de inversión'
    ];

    //Obtiene la información del usuario
    const getUserInformation = async (cubId) => {
        try {
            const { data, status} = await userService.userInformation(cubId);
            if(status === StatusEnum.OK) {
                setUserData(data);
            }
        } catch (error) {
            console.error("Error obteniendo la informacion del usuario:", error);
        }
    }

    const handleDeliveries = (cubId) => {
        navigate(`/admin/deliveries/${cubId}`)
    }

    //Imprime la autorización del usuario
    const handlePrintAuthorization = () => {
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

        printJS({
            printable: printContent,
            type: 'raw-html',
            documentTitle: 'Autorización Plan de Inversión',
        });
    }

    //Imprime el reporte de compras del usuario
    const handleHeadlineInformationToReport = async (cubId) => {
        setIsLoading(true);
        try {
            const { data, status} = await reportServices.headlineReport(cubId);
            if(status === StatusEnum.OK) {
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
                        <Row className="justify-content-around">
                            <Col xs={12} md={4} className="d-flex justify-content-center mb-3 mb-md-0">
                                <button onClick={handlePrintAuthorization} className="reporting-system-button general">
                                    <img src={imgFrame1} alt="icono general" className="button-icon" />
                                    AUTORIZACIÓN
                                </button>
                            </Col>
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

                <div>
                    <Container>
                        {/* Selects alineados en una nueva fila */}
                        <Row className="justify-content-start mt-4 mb-4">
                            <Col md={4}>
                                <div className="authorization-options">
                                    <h4 style={{ fontWeight: "bold", fontSize: "18px", color: "#2148C0", textAlign: 'center' }}>Selecciona las opciones para la autorización:</h4>
                                    <p style={{ fontWeight: "bold", fontSize: "10px", color: "#2148C0", textAlign: 'left'}}>Que la presente solicitud de actualización se fundamenta en: </p>
                                    <Select
                                        value={option1}
                                        onChange={setOption1}
                                        options={options.map((opt) => ({ value: opt, label: opt }))}
                                        placeholder="Selecciona la primera opción"
                                        classNamePrefix="custom-select"
                                        className="custom-select"
                                    />
                                    <Select
                                        value={option2}
                                        onChange={setOption2}
                                        options={options.map((opt) => ({ value: opt, label: opt }))}
                                        placeholder="Selecciona la segunda opción"
                                        classNamePrefix="custom-select"
                                        className="custom-select"
                                    />
                                    <Select
                                        value={option3}
                                        onChange={setOption3}
                                        options={options.map((opt) => ({ value: opt, label: opt }))}
                                        placeholder="Selecciona la tercera opción"
                                        classNamePrefix="custom-select"
                                        className="custom-select"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                {/* Aquí renderizas el componente pero lo ocultas */}
                <div style={{ display: 'none' }}>
                    <div ref={authorizationRef}>
                        <Authorization userData={userData} opt1={option1} opt2={option2} opt3={option3} />
                    </div>
                    {isReadyToPrintHeadLineInformation && (
                        <div ref={headlineReportRef}>
                            <HeadLineReport dataReport={headLineInformation} />
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </>
    )
}
import { useOutletContext, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import printJS from "print-js";

//img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgAdd from "../../../../assets/image/addProducts/imgAdd.png";
import imgFrame1 from "../../../../assets/image/icons/frame.png";
import imgFrame2 from "../../../../assets/image/icons/Frame1.png";

//Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import { Footer } from "../footer/Footer";
import { UserInformation } from "../user_information/UserInformation";
import { Authorization } from "./Authorization/Authorization";
import { ReportHeadLine } from "./ReportUser/ReportHeadLine";
import { ReportCompany } from "./ReportCompany/ReportCompany";

//Services
import { userService } from "../../../../helpers/services/UserServices";
import { reportServices } from "../../../../helpers/services/ReportServices";

//Css
import './Reports.css';

export const Reports = () => {
    const { userAuth } = useOutletContext();
    const params = useParams();

    //
    const authorizationRef = useRef();
    const headlineReportRef = useRef();
    const companyReportRef = useRef();

    //
    const [userData, setUserData] = useState({});
    const [headLineInformation, setHeadLineInformation] = useState({});
    const [companyInformation, setCompanyInformation] = useState({});

    const getUserInformation = async (cubId) => {
        await userService.userInformation(cubId).then((data) => {
            //console.log(data)
            setUserData(data);
        });
    }

    const getHeadlineReport = async (cubId) => {
        await reportServices.headlineReport(cubId).then((data) => {
            console.log('getHeadlineReport: ', data);
            setHeadLineInformation(data);
        });
    }

    const getCompanyReport = async () => {
        await reportServices.companyReport().then((data) => {
            setCompanyInformation(data);
        });
    }

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

        printJS({
            printable: printContent,
            type: 'raw-html',
            documentTitle: 'Autorización Plan de Inversión',
        });
    }

    const handlePrintHeadlineReport = () => {
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
            documentTitle: 'Reporte Beneficiario',
        });

    }

    const handlePrintCompanyReport = () => {
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
          ${companyReportRef.current.innerHTML} 
        </body>
        </html>`;

        printJS({
            printable: printContent,
            type: 'raw-html',
            documentTitle: 'Reporte Proveedor',
        });

    }

    useEffect(() => {
        if(params.id){
            if(userAuth.rol_id === 3) {
                getUserInformation(params.id);
                getHeadlineReport(params.id);
            }

            if(userAuth.rol_id === 2) {
                getCompanyReport(params.id);
            }
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

                {userAuth.rol_id === 3 && (
                    <>
                        {/* Contenedor de la información del usuario */}
                        <UserInformation userData={userData} />
                    </>
                )}

                <div className="search-banner-reports">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={12} className="d-flex justify-content-around">
                                {userAuth.rol_id === 2 && (
                                    <button onClick={handlePrintCompanyReport} className="report-button general">
                                        <img src={imgFrame1} alt="icono general" className="button-icon" />
                                        REPORTE GENERAL
                                    </button>
                                )}
                                {userAuth.rol_id === 3 && (
                                    <>
                                        <button onClick={handlePrintHeadlineReport} className="report-button unique">
                                            <img src={imgFrame2} alt="icono único" className="button-icon" />
                                            REPORTE POR BENEFICIARIOS
                                        </button>

                                        <button onClick={handlePrintAuthorization} className="report-button general">
                                            <img src={imgFrame1} alt="icono general" className="button-icon" />
                                            AUTORIZACIÓN
                                        </button>
                                    </>
                                )}
                                {/* Aquí renderizas el componente pero lo ocultas */}
                                <div style={{ display: 'none' }}>
                                    {userAuth.rol_id === 2 && (
                                        <div ref={companyReportRef}>
                                            <ReportCompany dataReport={companyInformation} />
                                        </div>
                                    )}
                                    {userAuth.rol_id === 3 && (
                                        <>
                                            <div ref={authorizationRef}>
                                                <Authorization userData={userData} />
                                            </div>
                                            <div ref={headlineReportRef}>
                                                <ReportHeadLine dataReport={headLineInformation} />
                                            </div>
                                        </>
                                    )}
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
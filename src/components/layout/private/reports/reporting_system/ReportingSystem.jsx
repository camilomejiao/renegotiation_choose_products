import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import printJS from "print-js";

//img
import imgDCSIPeople from "../../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgAdd from "../../../../../assets/image/addProducts/imgAdd.png";
import imgFrame from "../../../../../assets/image/icons/frame.png";
import imgFrame2 from "../../../../../assets/image/icons/Frame1.png";
import glass from "../../../../../assets/image/icons/magnifying_glass.png";

//Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
import { UserInformation } from "../../user_information/UserInformation";
import { HeadLineReport } from "./user_report/HeadLineReport";
import { AuthorizationSection } from "../../../shared/authorization_section/AuthorizationSection";
import { handleError, showAlert } from "../../../../../helpers/utils/utils";

//Services
import { userService } from "../../../../../helpers/services/UserServices";
import { reportServices } from "../../../../../helpers/services/ReportServices";

//Css
import './ReportingSystem.css';

//Enum
import { ComponentEnum, ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

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
    const [consolidated, setConsolidated] = useState("")

    //Obtiene la información del usuario
    const getUserInformation = async (cubId) => {
        try {
            const { data, status} = await userService.userInformation(cubId);
            if(status === ResponseStatusEnum.OK) {
                setUserData(data);
                setConsolidated(data?.consolidado);
            }
        } catch (error) {
            console.error("Error obteniendo la informacion del usuario:", error);
        }
    }

    const handleDeliveries = (cubId) => {
        navigate(`/admin/deliveries/${cubId}`)
    }

    //
    const handleUploadFile = (cubId, type) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/pdf";
        input.style.display = "none";

        // Captura el archivo seleccionado
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFileChange(file, cubId, "pdf", type);
            }
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    //Guardar archivos
    const handleFileChange = async (file, cubId, fileName, type) => {
        if (file) {
            // Validar el tipo de archivo
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                handleError('Archivo no válido', 'Solo se permiten imágenes (PNG, JPEG, JPG) o archivos PDF.');
                return;
            }

            const formData = new FormData();
            formData.append("ruta", file);

            setIsLoading(true);
            try {
                const { status } = await reportServices.uploadFileReport(cubId, formData);

                if (status === ResponseStatusEnum.CREATE || status === ResponseStatusEnum.OK) {
                    showAlert('Éxito', 'Archivo enviado exitosamente');
                    window.location.reload();
                }

                if (status !== ResponseStatusEnum.CREATE) {
                    handleError('Error', 'Error al enviar el archivo');
                }
            } catch (error) {
                console.error("Error al enviar el archivo:", error);
                handleError('Error', 'Error al enviar el archivo');
            } finally {
                setIsLoading(false);
            }
        }
    };

    //
    const handleViewFile = (pdfUrl) => {
        if (!pdfUrl) {
            handleError('Error', 'No hay un archivo cargado para este producto.');
            return;
        }
        window.open(pdfUrl, '_blank');
    };

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
                    backgroundIconColor={'#ff5722'}
                    bannerInformation={'Conoce los proyectos, compras y proveedores en un solo lugar.'}
                    backgroundInformationColor={'#0056b3'}
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
                            <Col xs={12} md={3} className="d-flex justify-content-center mb-3 mb-md-0">
                                <button onClick={() => handleHeadlineInformationToReport(params.id)} className="reporting-system-button unique">
                                    <img src={imgFrame2} alt="icono único" className="button-icon" />
                                    REPORTE DE COMPRAS POR TITULAR
                                </button>
                            </Col>
                            <Col xs={12} md={6} className="d-flex justify-content-center">
                                <button
                                    onClick={() => handleUploadFile(params.id, 'acuerdo')}
                                    className="reporting-system-button files">
                                    <img src={imgFrame} alt="icono único" className="button-icon" />
                                    DOCUMENTOS SOPORTE
                                </button>

                                {consolidated !== "" && (
                                    <button
                                        onClick={() => handleViewFile(consolidated)}
                                        rel="noopener noreferrer"
                                        className="reporting-system-button view-pdf">
                                        <img src={glass} alt="icono pdf" className="button-icon" />
                                        VER PDF
                                    </button>
                                )}
                            </Col>
                            <Col xs={12} md={3} className="d-flex justify-content-center justify-content-md-end">
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
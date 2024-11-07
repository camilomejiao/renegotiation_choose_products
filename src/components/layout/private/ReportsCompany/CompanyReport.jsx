import { useEffect, useRef, useState } from "react";
import {Col, Container, Row, Spinner} from "react-bootstrap";
import printJS from "print-js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

//Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import { CompanyReportPrinting } from "./report/CompanyReportPrinting";
import { Footer } from "../../shared/footer/Footer";

//Img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgAdd from "../../../../assets/image/addProducts/imgAdd.png";
import imgFrame1 from "../../../../assets/image/icons/frame.png";

//Services
import { reportServices } from "../../../../helpers/services/ReportServices";

//
import "./CompanyReport.css";
import { format } from "date-fns";
import Swal from "sweetalert2";


export const CompanyReport = () => {

    const companyReportRef = useRef();

    const [companyInformation, setCompanyInformation] = useState({});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReadyToPrint, setIsReadyToPrint] = useState(false);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const validateDates = async (startDate, endDate) => {
        if (!startDate || !endDate) {
            Swal.fire({
                title: 'Oops...',
                html: 'Por favor seleccione ambas fechas.',
                icon: 'error',
                width: 300,
                heightAuto: true
            });
            return false;
        }

        if (endDate < startDate) {
            Swal.fire({
                title: 'Oops...',
                html: 'La fecha final no puede ser anterior a la fecha inicial.',
                icon: 'error',
                width: 300,
                heightAuto: true
            });
            return false;
        }

        return true;
    };

    const handlePrintCompanyReport = async () => {
        if (! await validateDates(startDate, endDate)) {
            return;
        }

        setIsLoading(true);

        // Llamar a la API con las fechas seleccionadas
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');

        try {
            const { data } = await reportServices.companyReport(formattedStartDate, formattedEndDate);
            console.log("Datos del reporte:", data);
            setCompanyInformation(data);
            setIsReadyToPrint(true);
        } catch (error) {
            console.error("Error obteniendo el reporte:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const printReport = () => {
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
        if (isReadyToPrint && companyInformation) {
            printReport(); // Imprime cuando los datos estén listos
            setIsReadyToPrint(false); // Reinicia el estado para evitar imprimir nuevamente
        }
    }, [companyInformation, isReadyToPrint]);

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgDCSIPeople}
                    titleHeader={'¡Explora el banco de proveedores!'}
                    bannerIcon={imgAdd}
                    bannerInformation={'Conoce los proyectos, compras y proveedores en un solo lugar.'}
                />

                {isLoading && (
                    <div className="spinner-container">
                        <Spinner animation="border" variant="success" />
                        <span>Cargando...</span>
                    </div>
                )}

                <div className="banner-reports">
                    <Container>
                        <Row className="justify-content-center align-items-center">
                            {/* Selectores de Fecha */}
                            <Col md={4} className="d-flex flex-column">
                                <div className="date-picker-wrapper">
                                    <FaCalendarAlt className="calendar-icon" />
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleStartDateChange}
                                        className="form-control custom-date-picker"
                                        placeholderText="Seleccione una fecha inicial"
                                    />
                                </div>
                            </Col>

                            <Col md={4} className="d-flex flex-column">
                                <div className="date-picker-wrapper">
                                    <FaCalendarAlt className="calendar-icon" />
                                    <DatePicker
                                        selected={endDate}
                                        onChange={handleEndDateChange}
                                        className="form-control custom-date-picker"
                                        placeholderText="Seleccione una fecha final"
                                    />
                                </div>
                            </Col>

                            {/* Botón Reporte General */}
                            <Col md={4} className="d-flex justify-content-center">
                                <button
                                    onClick={handlePrintCompanyReport}
                                    className="report-button general"
                                >
                                    <img src={imgFrame1} alt="icono general" className="button-icon" />
                                    REPORTE GENERAL
                                </button>
                            </Col>
                        </Row>
                    </Container>
                </div>

                {/* Aquí renderizas el componente pero lo ocultas */}
                <div style={{ display: 'none' }}>
                    {companyInformation && (
                        <div ref={companyReportRef}>
                            <CompanyReportPrinting titleReport={'CONSOLIDADO DE VENTAS'} dataReport={companyInformation} userData={''} isCompanyReport={true} />
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </>
    )
}
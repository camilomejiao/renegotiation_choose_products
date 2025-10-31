import {useEffect, useRef, useState} from "react";
import {Col, Container, Dropdown, Row, Spinner} from "react-bootstrap";
import printJS from "print-js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import * as XLSX from 'xlsx';

//Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
import { CompanyReportPrinting } from "./report/CompanyReportPrinting";
import { format } from "date-fns";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Img
import imgDCSIPeople from "../../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgAdd from "../../../../../assets/image/addProducts/imgAdd.png";
import imgFrame1 from "../../../../../assets/image/icons/frame.png";
import imgFrame2 from "../../../../../assets/image/icons/Frame1.png";

//Services
import { reportServices } from "../../../../../helpers/services/ReportServices";

//Css
import "./CompanyReport.css";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

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
            AlertComponent.error('Oops...', 'Por favor seleccione ambas fechas.');
            return false;
        }

        if (endDate < startDate) {
            AlertComponent.error('Oops...', 'La fecha final no puede ser anterior a la fecha inicial.');
            return false;
        }

        return true;
    };

    const handlePrintCompanyReport = async (reportType) => {
        if (! await validateDates(startDate, endDate)) {
            return;
        }

        setIsLoading(true);

        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');

        try {
            const { data, status } = await reportServices.companyReport(formattedStartDate, formattedEndDate);
            if(status === ResponseStatusEnum.OK) {
                if(reportType === 'pdf') {
                    setCompanyInformation(data);
                    setIsReadyToPrint(true);
                }

                if (reportType === 'excel') {
                    handleExportToExcel(data);
                }
            }
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

    //
    const handleExportToExcel = (reportData) => {
        const transformedData = transformDataForExcel(reportData); // Transformamos los datos
        exportToExcel(transformedData); // Exportamos a Excel
    };

    //
    const transformDataForExcel = (data) => {

        //Validamos la data
        const distributors = Array.isArray(data) ? data : [data];

        //.flatMap combina los pasos de iterar y aplanar la estructura de datos. Es útil cuando cada iteración genera múltiples filas
        return distributors.flatMap((distributor) => {
            const {nombre: distributorName, nit, cubs} = distributor;

            return Object.values(cubs).flatMap((cub) => {
                const {cub_id: cubId, nombre, cedula, departamento, municipio, vereda, productos: products} = cub;

                return Object.values(products).map((product) => ({
                    "Nombre Proveedor": distributorName,
                    "NIT": nit,
                    "CUB": cubId,
                    "Beneficiario": nombre,
                    "Cedula": cedula,
                    "Departamento": departamento,
                    "Municipio": municipio,
                    "Vereda": vereda,
                    "Producto": product.nombre,
                    "Marca": product.marca,
                    "Unidad": product.unidad,
                    "Precio Unitario": product.precio,
                    "Cantidad": product.cantidad,
                    "Descuento": product.descuento + '%',
                    "Total": product.total,
                }));
            });
        });
    };

    //
    const exportToExcel = (data) => {
        //Formateamos los datos
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

        //Descargar el archivo
        XLSX.writeFile(workbook, "Reporte_Consolidado_De_Ventas.xlsx");
    };

    const handleDownloadInstructions = () => {
        window.open("https://proveedor.direccionsustitucion.gov.co/archivos/formatos/2024-11-07_PAGOS_PROVEEDORES.pdf", "_blank");
    };

    const handleDocumentsForPaymentRequest = () => {
        window.open("https://proveedor.direccionsustitucion.gov.co/archivos/formatos/DOCUMENTOS_ENVIO_SOLICITUD_PAGO.pdf", "_blank");
    };

    const handleCollectionAccountFormat = () => {
        window.open("https://proveedor.direccionsustitucion.gov.co/archivos/formatos/FORMATO_CUENTA_DE_COBRO_PN.xlsx", "_blank");
    };

    const handleAccountList = () => {
        window.open("https://proveedor.direccionsustitucion.gov.co/archivos/formatos/RELACION_CUENTAS.xlsx", "_blank");
    };

    useEffect(() => {
        if (isReadyToPrint && companyInformation) {
            printReport();
            setIsReadyToPrint(false);
        }
    }, [companyInformation, isReadyToPrint]);

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgDCSIPeople}
                    titleHeader={'¡Explora el banco de proveedores!'}
                    bannerIcon={imgAdd}
                    backgroundIconColor={'#f66d1f'}
                    bannerInformation={'Conoce los proyectos, compras y proveedores en un solo lugar.'}
                    backgroundInformationColor={'#2148C0'}
                />

                {isLoading && (
                    <div className="spinner-container">
                        <Spinner animation="border" variant="success" />
                        <span>Cargando...</span>
                    </div>
                )}

                <div className="banner-reports">
                    <Container>
                        <Row className="justify-content-start align-items-center">
                            {/* Selectores de Fecha */}
                            <Col md={3} className="d-flex flex-column">
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

                            <Col md={3} className="d-flex flex-column">
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

                            {/* Dropdown Reporte General */}
                            <Col md={3} className="d-flex flex-column justify-content-center">
                                <Dropdown>
                                    <Dropdown.Toggle className="report-button general">
                                        <img src={imgFrame1} alt="reporte general" className="button-icon" />
                                        REPORTE GENERAL
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handlePrintCompanyReport('excel')}>
                                            Exportar a Excel
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handlePrintCompanyReport('pdf')}>
                                            Exportar a PDF
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>

                        </Row>
                    </Container>
                </div>

                {/* Aquí renderizas el componente pero lo ocultas */}
                <div style={{ display: 'none' }}>
                    {companyInformation && (
                        <div ref={companyReportRef}>
                            <CompanyReportPrinting
                                titleReport={'CONSOLIDADO DE VENTAS'}
                                dataReport={companyInformation}
                                userData={''}
                                isCompanyReport={true}
                            />
                        </div>
                    )}
                </div>

            </div>
        </>
    )
}
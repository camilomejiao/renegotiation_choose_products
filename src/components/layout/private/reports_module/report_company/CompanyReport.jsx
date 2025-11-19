import printJS from "print-js";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import {
  FaBook,
  FaDownload,
  FaFileAlt,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";
import * as XLSX from "xlsx";

//Components
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { Breadcrumb } from "../../../../shared/Breadcrumb";
import { ModernBanner } from "../../../../shared/ModernBanner";
import { CompanyReportPrinting } from "./report/CompanyReportPrinting";

//Img
import imgAdd from "../../../../../assets/image/addProducts/imgAdd.png";
import imgDCSIPeople from "../../../../../assets/image/addProducts/imgDSCIPeople.png";

//Services
import { reportServices } from "../../../../../helpers/services/ReportServices";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

export const CompanyReport = () => {
  const companyReportRef = useRef();

  const [companyInformation, setCompanyInformation] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReadyToPrint, setIsReadyToPrint] = useState(false);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const validateDates = async (startDate, endDate) => {
    if (!startDate || !endDate) {
      AlertComponent.error("Oops...", "Por favor seleccione ambas fechas.");
      return false;
    }

    if (new Date(endDate) < new Date(startDate)) {
      AlertComponent.error(
        "Oops...",
        "La fecha final no puede ser anterior a la fecha inicial."
      );
      return false;
    }

    return true;
  };

  const handlePrintCompanyReport = async (reportType) => {
    if (!(await validateDates(startDate, endDate))) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, status } = await reportServices.companyReport(
        startDate,
        endDate
      );
      if (status === ResponseStatusEnum.OK) {
        if (reportType === "pdf") {
          setCompanyInformation(data);
          setIsReadyToPrint(true);
        }

        if (reportType === "excel") {
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
      type: "raw-html",
      documentTitle: "Reporte Proveedor",
    });
  };

  const handleExportToExcel = (reportData) => {
    const transformedData = transformDataForExcel(reportData);
    exportToExcel(transformedData);
  };

  const transformDataForExcel = (data) => {
    const distributors = Array.isArray(data) ? data : [data];

    return distributors.flatMap((distributor) => {
      const { nombre: distributorName, nit, cubs } = distributor;

      return Object.values(cubs).flatMap((cub) => {
        const {
          cub_id: cubId,
          nombre,
          cedula,
          departamento,
          municipio,
          vereda,
          productos: products,
        } = cub;

        return Object.values(products).map((product) => ({
          "Nombre Proveedor": distributorName,
          NIT: nit,
          CUB: cubId,
          Beneficiario: nombre,
          Cedula: cedula,
          Departamento: departamento,
          Municipio: municipio,
          Vereda: vereda,
          Producto: product.nombre,
          Marca: product.marca,
          Unidad: product.unidad,
          "Precio Unitario": product.precio,
          Cantidad: product.cantidad,
          Descuento: product.descuento + "%",
          Total: product.total,
        }));
      });
    });
  };

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

    XLSX.writeFile(workbook, "Reporte_Consolidado_De_Ventas.xlsx");
  };

  const handleDownloadInstructions = () => {
    window.open(
      "https://proveedor.direccionsustitucion.gov.co/archivos/formatos/2024-11-07_PAGOS_PROVEEDORES.pdf",
      "_blank"
    );
  };

  const handleDocumentsForPaymentRequest = () => {
    window.open(
      "https://proveedor.direccionsustitucion.gov.co/archivos/formatos/DOCUMENTOS_ENVIO_SOLICITUD_PAGO.pdf",
      "_blank"
    );
  };

  const handleCollectionAccountFormat = () => {
    window.open(
      "https://proveedor.direccionsustitucion.gov.co/archivos/formatos/FORMATO_CUENTA_DE_COBRO_PN.xlsx",
      "_blank"
    );
  };

  const handleAccountList = () => {
    window.open(
      "https://proveedor.direccionsustitucion.gov.co/archivos/formatos/RELACION_CUENTAS.xlsx",
      "_blank"
    );
  };

  useEffect(() => {
    if (isReadyToPrint && companyInformation) {
      printReport();
      setIsReadyToPrint(false);
    }
  }, [companyInformation, isReadyToPrint]);

  if (isLoading) {
    return (
      <div className="overlay">
        <div className="loader">
          <div className="spinner-border"></div>
          <div className="spinner-text">Generando reporte...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb />
      <div className="container-fluid px-4">
        {/* Header */}
        <ModernBanner
          imageHeader={imgDCSIPeople}
          titleHeader="¡Explora el banco de proveedores!"
          bannerIcon={imgAdd}
          backgroundIconColor="#f66d1f"
          bannerInformation="Conoce los proyectos, compras y proveedores en un solo lugar."
          backgroundInformationColor="#2148C0"
          infoText="Genere reportes y acceda a documentos necesarios para la gestión de pagos."
        />

        {/* Report Generation Section */}
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">
              <FaFileAlt className="me-2" />
              Generar Reportes
            </h2>
            <p className="form-subtitle">
              Seleccione el rango de fechas y genere reportes en Excel o PDF
            </p>
          </div>

          <div className="card">
            <div className="card-body">
              <Row className="align-items-end">
                <Col md={4}>
                  <label className="form-label">Fecha Inicial</label>
                  <div className="date-picker-wrapper">
                    <input
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      className="form-control custom-date-picker"
                    />
                  </div>
                </Col>

                <Col md={4}>
                  <label className="form-label">Fecha Final</label>
                  <div className="date-picker-wrapper">
                    <input
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      className="form-control custom-date-picker"
                    />
                  </div>
                </Col>

                <Col md={4}>
                  <ButtonGroup className="w-100">
                    <Button
                      variant="outline-success"
                      onClick={() => handlePrintCompanyReport("excel")}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <FaFileExcel className="me-2" />
                      Excel
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handlePrintCompanyReport("pdf")}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <FaFilePdf className="me-2" />
                      PDF
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">
              <FaBook className="me-2" />
              Documentos y Formatos
            </h2>
            <p className="form-subtitle">
              Acceda a instructivos, formatos y documentos necesarios para la gestión de pagos
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Instructivos</span>
                <div className="stat-card-icon">
                  <FaBook />
                </div>
              </div>
              <button
                onClick={handleDownloadInstructions}
                className="btn btn-primary w-100 mt-3"
              >
                <FaDownload className="me-2" />
                Instructivo para Pagos
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Documentos</span>
                <div className="stat-card-icon">
                  <FaFilePdf />
                </div>
              </div>
              <button
                onClick={handleDocumentsForPaymentRequest}
                className="btn btn-success w-100 mt-3"
              >
                <FaDownload className="me-2" />
                Documentos para Solicitud
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Formatos</span>
                <div className="stat-card-icon">
                  <FaFileExcel />
                </div>
              </div>
              <button
                onClick={handleCollectionAccountFormat}
                className="btn btn-warning w-100 mt-3"
              >
                <FaDownload className="me-2" />
                Formato Cuenta de Cobro
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Solicitudes</span>
                <div className="stat-card-icon">
                  <FaFileAlt />
                </div>
              </div>
              <button
                onClick={handleAccountList}
                className="btn btn-info w-100 mt-3"
              >
                <FaDownload className="me-2" />
                Solicitud de Pago
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Report Component */}
        <div style={{ display: "none" }}>
          {companyInformation && (
            <div ref={companyReportRef}>
              <CompanyReportPrinting
                titleReport={"CONSOLIDADO DE VENTAS"}
                dataReport={companyInformation}
                userData={""}
                isCompanyReport={true}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import {FaFileAlt, FaFileInvoiceDollar, FaFilePdf, FaFileSignature, FaUpload} from "react-icons/fa";import printJS from "print-js";

//img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgAdd from "../../../../assets/image/addProducts/imgAdd.png";
import imgFrame2 from "../../../../assets/image/icons/Frame1.png";

//Components
import { HeaderImage } from "../../shared/header_image/HeaderImage";
import { UserInformation } from "../../shared/user_information/UserInformation";
import { handleError, showAlert } from "../../../../helpers/utils/utils";
import { AuthorizationSection } from "../../shared/authorization_section/AuthorizationSection";
import { ConsolidatedPurchaseReport } from "./beneficiaries_report/ConsolidatedPurchaseReport";
import { BalanceInFavorReport } from "./balance_in_favor_report/BalanceInFavorReport";
import { Loading } from "../../shared/loading/Loading";

//Services
import { userServices } from "../../../../helpers/services/UserServices";
import { reportServices } from "../../../../helpers/services/ReportServices";
import { filesServices } from "../../../../helpers/services/FilesServices";

//Enum
import { BeneficiaresManagementEnum, ComponentEnum, ResponseStatusEnum } from "../../../../helpers/GlobalEnum";

//Helpers
import AlertComponent from "../../../../helpers/alert/AlertComponent";

const pickLatest = (arr = []) => (Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null);
export const BeneficiariesManagement = () => {
    const params = useParams();
    const navigate = useNavigate();

    //
    const headlineReportRef = useRef();
    const headlineBalanceRef = useRef();

    //
    const [userData, setUserData] = useState({});
    const [headLineInformation, setHeadLineInformation] = useState({});
    const [isReadyToPrintHeadLineInformation, setIsReadyToPrintHeadLineInformation] = useState(false);
    const [isReadyToPrintBalanceInFavor, setIsReadyToPrintBalanceInFavor] = useState(false);
    const [loading, setLoading] = useState(false);
    const [consolidated, setConsolidated] = useState("");
    const [balance, setBalance] = useState("");

    //Obtiene la información del usuario
    const getUserInformation = async (cubId) => {
        try {
            const { data, status} = await userServices.userInformation(cubId);
            if(status === ResponseStatusEnum.OK) {
                setUserData(data);

                const archivos = data?.archivos ?? {};
                const consolidado = pickLatest(archivos[BeneficiaresManagementEnum.CONSOLIDATED]);
                const saldo       = pickLatest(archivos[BeneficiaresManagementEnum.BALANCE]);

                setConsolidated(consolidado?.ruta ?? null);
                setBalance(saldo?.ruta ?? null);
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
            formData.append("tipo", type);
            formData.append("ruta", file);

            setLoading(true);
            try {
                const { status } = await filesServices.uploadFileReport(cubId, formData);

                if (status === ResponseStatusEnum.CREATED || status === ResponseStatusEnum.OK) {
                    showAlert('Éxito', 'Archivo enviado exitosamente');
                    window.location.reload();
                }

                if (status !== ResponseStatusEnum.CREATED) {
                    handleError('Error', 'Error al enviar el archivo');
                }
            } catch (error) {
                console.error("Error al enviar el archivo:", error);
                handleError('Error', 'Error al enviar el archivo');
            } finally {
                setLoading(false);
            }
        }
    };

    //
    const handleViewFile = async (pdfUrl) => {
        if (!pdfUrl) {
            handleError('Error', 'No hay un archivo cargado para este producto.');
            return;
        }

        try {
            setLoading(true);
            const {blob, status} = await filesServices.downloadFile(pdfUrl);

            if (status === ResponseStatusEnum.OK && blob) {
                const file = new Blob([blob], {type: "application/pdf"});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, '_blank');
            }
            if (status === ResponseStatusEnum.NOT_FOUND) {
                AlertComponent.error('Error', 'No se puede descargar el archivo.');
            }
        } catch (error) {
            console.error("Error al descargar archivo:", error);
        } finally {
            setLoading(false);
        }
    };

    //Imprime el reporte de compras del usuario
    const handleHeadlineInformationToReport = async (cubId, type = "") => {
        setLoading(true);
        try {
            const { data, status} = await reportServices.headlineReport(cubId);
            if(status === ResponseStatusEnum.OK) {
                setHeadLineInformation(data);
                if(type === BeneficiaresManagementEnum.CONSOLIDATED) {
                    setIsReadyToPrintHeadLineInformation(true);
                }

                if(type === BeneficiaresManagementEnum.BALANCE) {
                    const bruto = (Number(data?.saldo) || 0) - (Number(data?.invertido) || 0);
                    const valor = Math.max(0, Math.round(bruto));
                   if(valor > 10000 || valor === 0) {
                       AlertComponent.warning("", "El saldo debe ser inferior a $ 10.000 PESOS M/CTE y mayor a 0");
                       return;
                   }
                   setIsReadyToPrintBalanceInFavor(true);
                }
            }
        } catch (error) {
            console.error("Error obteniendo el reporte:", error);
        } finally {
            setLoading(false);
        }
    }

    //pdf de compras consolidadas del usuario
    const printHeadlineReport = (ref) => {
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
          ${ref.current.innerHTML} 
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
            printHeadlineReport(headlineReportRef);
            setIsReadyToPrintHeadLineInformation(false);
        }
    }, [isReadyToPrintHeadLineInformation]);

    //Al dar click en el reporte
    useEffect(() => {
        if (isReadyToPrintBalanceInFavor) {
            printHeadlineReport(headlineBalanceRef);
            setIsReadyToPrintBalanceInFavor(false);
        }
    }, [isReadyToPrintBalanceInFavor]);

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

                {loading && <Loading text="Cargando..." />}

                <div className="beneficiaries-docs">
                    <Container>
                        <div className="beneficiaries-docs__header">
                            <h2>Documentos y Reportes</h2>
                            <p>Acceda a instructivos, formatos y documentos necesarios para la gestión de pagos</p>
                        </div>
                        <div className="beneficiaries-docs__grid beneficiaries-docs__grid--two-rows">
                            <div className="beneficiaries-docs__card">
                                <div className="beneficiaries-docs__card-top">
                                    <span className="beneficiaries-docs__card-title">Consolidado</span>
                                    <span className="beneficiaries-docs__card-icon beneficiaries-docs__card-icon--primary">
                                        <FaFileAlt />
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleHeadlineInformationToReport(params.id, BeneficiaresManagementEnum.CONSOLIDATED)}
                                    className="beneficiaries-docs__button beneficiaries-docs__button--primary"
                                >
                                    Documento Consolidado Orden de Compra
                                </button>
                            </div>

                            <div className="beneficiaries-docs__card">
                                <div className="beneficiaries-docs__card-top">
                                    <span className="beneficiaries-docs__card-title">Documentos</span>
                                    <span className="beneficiaries-docs__card-icon beneficiaries-docs__card-icon--success">
                                        <FaUpload />
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleUploadFile(params.id, BeneficiaresManagementEnum.CONSOLIDATED)}
                                    className="beneficiaries-docs__button beneficiaries-docs__button--success"
                                >
                                    Cargar Consolidado Orden de Compra
                                </button>
                            </div>

                            <div className="beneficiaries-docs__card">
                                <div className="beneficiaries-docs__card-top">
                                    <span className="beneficiaries-docs__card-title">Ver PDF</span>
                                    <span className="beneficiaries-docs__card-icon beneficiaries-docs__card-icon--info">
                                        <FaFilePdf />
                                    </span>
                                </div>
                                {consolidated ? (
                                    <button
                                        onClick={() => handleViewFile(consolidated)}
                                        rel="noopener noreferrer"
                                        className="beneficiaries-docs__button beneficiaries-docs__button--info"
                                    >
                                        Ver PDF
                                    </button>
                                ) : (
                                    <button
                                        className="beneficiaries-docs__button beneficiaries-docs__button--disabled"
                                        disabled
                                    >
                                        Sin PDF
                                    </button>
                                )}
                            </div>

                            <div className="beneficiaries-docs__card">
                                <div className="beneficiaries-docs__card-top">
                                    <span className="beneficiaries-docs__card-title">Saldo a Favor</span>
                                    <span className="beneficiaries-docs__card-icon beneficiaries-docs__card-icon--warning">
                                        <FaFileSignature />
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleHeadlineInformationToReport(params.id, BeneficiaresManagementEnum.BALANCE)}
                                    className="beneficiaries-docs__button beneficiaries-docs__button--warning"
                                >
                                    Documento Saldo a Favor
                                </button>
                            </div>

                            <div className="beneficiaries-docs__card">
                                <div className="beneficiaries-docs__card-top">
                                    <span className="beneficiaries-docs__card-title">Solicitud</span>
                                    <span className="beneficiaries-docs__card-icon beneficiaries-docs__card-icon--success">
                                        <FaUpload />
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleUploadFile(params.id, BeneficiaresManagementEnum.BALANCE)}
                                    className="beneficiaries-docs__button beneficiaries-docs__button--success"
                                >
                                    Cargar Saldo a Favor
                                </button>
                            </div>

                            <div className="beneficiaries-docs__card">
                                <div className="beneficiaries-docs__card-top">
                                    <span className="beneficiaries-docs__card-title">Ver PDF</span>
                                    <span className="beneficiaries-docs__card-icon beneficiaries-docs__card-icon--info">
                                        <FaFileInvoiceDollar />
                                    </span>
                                </div>
                                {balance ? (
                                    <button
                                        onClick={() => handleViewFile(balance)}
                                        rel="noopener noreferrer"
                                        className="beneficiaries-docs__button beneficiaries-docs__button--info"
                                    >
                                        Ver PDF
                                    </button>
                                ) : (
                                    <button
                                        className="beneficiaries-docs__button beneficiaries-docs__button--disabled"
                                        disabled
                                    >
                                        Sin PDF
                                    </button>
                                )}
                            </div>
                        </div>
                    </Container>
                </div>
                <div className="beneficiaries-side">
                    <div className="beneficiaries-side__auth">
                        <AuthorizationSection component={ComponentEnum.USER} userData={userData} wide={12} />
                    </div>
                    <div className="beneficiaries-side__deliveries">
                        <button onClick={() => handleDeliveries(params.id)} className="reporting-system-button deliveries">
                            <img src={imgFrame2} alt="icono único" className="button-icon" />
                            ENTREGAS
                        </button>
                        <p className="beneficiaries-side__hint">
                            Accede al módulo de entregas del beneficiario.
                        </p>
                    </div>
                </div>

                {/* Aqui renderizas el componente pero lo ocultas */}
                <div style={{ display: 'none' }}>
                    {isReadyToPrintHeadLineInformation && (
                        <div ref={headlineReportRef}>
                            <ConsolidatedPurchaseReport dataReport={headLineInformation} />
                        </div>
                    )}
                </div>

                {/* Aquí renderizas el componente pero lo ocultas */}
                <div style={{ display: 'none' }}>
                    {isReadyToPrintBalanceInFavor && (
                        <div ref={headlineBalanceRef}>
                            <BalanceInFavorReport dataReport={headLineInformation} />
                        </div>
                    )}
                </div>

            </div>
        </>
    )
}










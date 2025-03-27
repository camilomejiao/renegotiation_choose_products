import { useEffect, useRef, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import printJS from "print-js";
import { Button, Col, Container, Row, Form, Spinner } from "react-bootstrap";
import { TextField } from "@mui/material";
import { FaEye } from "react-icons/fa";

//Services
import { renegotiationServices } from "../../../../helpers/services/RenegociationServices";

//Components
import AlertComponent from "../../../../helpers/alert/AlertComponent";
import { UserInformation } from "../user-information/UserInformation";
import { PlanInversion } from "./plan/PlanInversion";
import { LineDetailModal } from "../../shared/Modals/LineDetailModal";

//Enum
import {ComponentEnum, ResponseStatusEnum} from "../../../../helpers/GlobalEnum";
import { AuthorizationSection } from "../../shared/authorization-section/AuthorizationSection";
import {PlanHistory} from "../../shared/Modals/PlanHistory";
import {ConfirmationModal} from "../../shared/Modals/ConfirmationModal";
export const Renegociation = () => {

    const params = useParams();
    const navigate = useNavigate();
    const planRef = useRef();

    const [userData, setUserData] = useState({});
    const [engagementId, setEngagementId] = useState('');
    const [engagement, setEngagement] = useState({});
    const [planOptions, setPlanOptions] = useState([]);
    const [lineaOptions, setLineaOptions] = useState([]);
    const [formData, setFormData] = useState({
        PlanId: "",
        LineaId: "",
    });
    const [comentarios, setComentarios] = useState("");
    const [cellPhone, setCellPhone] = useState("");
    const [isReadyToPrintPlan, setIsReadyToPrintPlan] = useState(false);
    const [showModalLineDatail, setShowModalLineDatail] = useState(false);
    const [lineDetailData, setLineDetailData] = useState("");
    const [showModalPlanHistory, setShowModalPlanHistory] = useState(false);
    const [planHistoryData, setPlanHistoryData] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [uploadParams, setUploadParams] = useState({ cubId: null, type: null });

    const getUserInformation = async (cubId) => {
        setIsLoading(true);
        try {
            const {data, status} = await renegotiationServices.getUserRenegotiation(1, cubId);
            if(status === ResponseStatusEnum.OK && Object.keys(data).length > 0) {
                setUserData(data);
                setEngagementId(cubId);
                setComentarios(data?.comentario);
                await getInformationRenegotiation(data?.plan_id, data?.linea_id, cubId);
                await handlePlanHistory(cubId);
            }

            if(Object.keys(data).length === 0) {
                showError('Error', 'Este usuario tiene un problema, habla con tu administrador');
                navigate(`/admin/`)
            }
        } catch (error) {
            console.log(error);
            showError(error, 'Error buscando el usuario');
        } finally {
            setIsLoading(false);
        }
    }

    const getInformationRenegotiation = async (planId, lineId, cubId) => {
        try {
            const { data: lines } = await renegotiationServices.getLine(planId, cubId);
            setLineaOptions(lines);

            setFormData(prevState => ({
                ...prevState,
                PlanId: planId || "",
                LineaId: lines.some(line => line?.id === lineId) ? lineId : "",
            }));
        } catch (error) {
            console.log(error);
        }
    }

    //Cargar planes
    const getPlans = async () => {
        try {
            const { data, status} = await renegotiationServices.getPlan();
            if(status === ResponseStatusEnum.OK) {
                setPlanOptions(data);
            }
        } catch (error) {
            console.log(error);
            showError(error, 'Error buscando el usuario');
        }
    }

    // Método para obtener líneas al cambiar el PlanId
    const handlePlanChange = async (e) => {
        const planId = e.target.value;
        setFormData({ PlanId: planId, LineaId: "" });

        if (planId) {
            const { data } = await renegotiationServices.getLine(planId, engagementId);
            setLineaOptions(data);
        }
    };

    // Lógica para habilitar/deshabilitar el botón de guardar
    const isSaveEnabled = () => {
        return comentarios && cellPhone && formData.PlanId && formData.LineaId && (formData.LineaId !== userData.linea_id);
    }

    //
    const showAlert = (title, message) => {
        AlertComponent.success(title, message)
    };

    //
    const showError = (title, message) => {
        AlertComponent.error(title, message);
    };

    const handleSaveInformationUser = async () => {
        setIsLoading(true);
        let updateData = {
            plan: formData.PlanId,
            linea: formData.LineaId,
            telefono: cellPhone,
            comentario: comentarios
        }
        try {
            const {data, status} = await renegotiationServices.updateUserInformationRenegotiation(engagementId, updateData);
            if(status === ResponseStatusEnum.NOT_FOUND) {
                showError('error', data.detail);
            }

            if(status === ResponseStatusEnum.OK) {
                showAlert('Bien hecho!', 'Actualización realizada con exito');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.log(error);
            showError(error, 'Error al actualizar la información');
        } finally {
            setIsLoading(false);
        }
    }

    const handlePlanToReport = async () => {
        setIsLoading(true);
        try {
            const {data, status} = await renegotiationServices.getInformationEngagement(engagementId);
            if (status === ResponseStatusEnum.OK) {
                setEngagement(data);
                setIsReadyToPrintPlan(true);
            }
        } catch (error) {
            console.log(error);
            showError(error, 'Error buscando el contrato');
        } finally {
            setIsLoading(false);
        }
    }

    const handleModalDetail = async () => {
        setIsLoading(true);
        try {
            const {data, status} = await renegotiationServices.getDetailPlan(formData.LineaId);
            if (status === ResponseStatusEnum.OK) {
                setLineDetailData(data);
                setShowModalLineDatail(true);
            }
        } catch (error) {
            console.log(error);
            showError(error, 'Error buscando el detalle');
        } finally {
            setIsLoading(false);
        }
    }

    const handlePlanHistory = async (cubId) => {
        setIsLoading(true);
        try {
            const {data, status} = await renegotiationServices.getPlanHistory(cubId);
            if (status === ResponseStatusEnum.OK) {
                setPlanHistoryData(data);
                setShowModalPlanHistory(true);
            }
        } catch (error) {
            console.log(error);
            showError(error, 'Error buscando el historico');
        } finally {
            setIsLoading(false);
        }
    }

    const handleCloseModal = () => {
        setShowModalLineDatail(false);
        setLineDetailData('');
        setShowModalPlanHistory(false);
        setPlanHistoryData('');
        setShowModalConfirmation(false);
        setUploadParams({ cubId: null, type: null });
    };

    //
    const handlePrintPlan = () => {
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
          ${planRef.current.innerHTML} 
        </body>
        </html>`;

        printJS({
            printable: printContent,
            type: 'raw-html',
            documentTitle: 'Plan de Inversión',
        });
    }

    //
    const handleShowConfirmationModal = (cubId, type) => {
        setUploadParams({ cubId, type });
        setShowModalConfirmation(true);
    };

    //
    const handleConfirmUpload = () => {
        handleUploadFile(uploadParams.cubId, uploadParams.type);
        setShowModalConfirmation(false);
    };

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
    };

    //Guardar archivos
    const handleFileChange = async (file, cubId, fileName, type) => {
        if (file) {
            // Validar el tipo de archivo
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                showError('Archivo no válido', 'Solo se permiten imágenes (PNG, JPEG, JPG) o archivos PDF.');
                return;
            }

            const formData = new FormData();
            formData.append("archivo", file);
            formData.append("tipo", type);

            setIsLoading(true);
            try {
                const { status } = await renegotiationServices.sendEngagement(cubId, formData);

                if (status === ResponseStatusEnum.CREATE || status === ResponseStatusEnum.OK) {
                    showAlert('Éxito', 'Archivo enviado exitosamente');
                    window.location.reload();
                }

                if (status !== ResponseStatusEnum.CREATE) {
                    showError('Error', 'Error al enviar el archivo');
                }
            } catch (error) {
                console.error("Error al enviar el archivo:", error);
                showError('Error', 'Error al enviar el archivo');
            } finally {
                setIsLoading(false);
            }
        }
    };

    //
    const handleDownload = async (cubId, type) => {
        try {
            setIsLoading(true);
            const {status, blob} = await renegotiationServices.getEngagementDownload(cubId, type);
            if (!blob || status !== ResponseStatusEnum.OK) {
                showError('Error', `Error en la descarga`);
                throw new Error(`Error en la descarga: ${status}`);
            }

            // Si la respuesta contiene un Blob, descargar el archivo
            if (blob) {
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = `${type}_${cubId}.pdf`; // Nombre del archivo
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url);
            } else {
                showError('Error', 'No se recibió un archivo válido.');
            }
        } catch (error) {
            console.error("Error al descargar el archivo:", error);
        } finally {
            setIsLoading(false);
        }
    };

    //
    const isValidUserData = () => {
        return userData.plan_anterior !== "" && userData.linea_anterior !== "";
    };

    useEffect(() => {
        if (params.cub_id) {
            getUserInformation(params.cub_id);
        }
        getPlans();
    }, [params.cub_id]);

    useEffect(() => {
        if (engagement && isReadyToPrintPlan) {
            handlePrintPlan();
            setIsReadyToPrintPlan(false);
        }
    },[engagement, isReadyToPrintPlan]);

    return (
        <>
            <div className="main-container">
                <div className="header-image position-relative">
                    <img src={imgDCSIPeople} alt="Fondo" className="background-image w-100" />
                    <div className="overlay-text position-absolute w-100 text-center">
                        <h1>¡Renegociación!</h1>
                    </div>
                </div>

                {/* Contenedor de la información del usuario */}
                <UserInformation userData={userData} />

                <Container>
                    <Row className="justify-content-start align-items-center mt-4">
                        {/* Select para Plan */}
                        <Col xs={12} md={3} className="mb-3">
                            <Form.Group>
                                <Form.Label>Plan</Form.Label>
                                <Form.Select name="PlanId" value={formData.PlanId} onChange={handlePlanChange}>
                                    <option value="">Seleccione Plan...</option>
                                    {planOptions.map((plan) => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {/* Select para Línea */}
                        <Col xs={12} md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Linea</Form.Label>
                                <Form.Select
                                    name="LineaId"
                                    value={formData.LineaId}
                                    onChange={(e) => setFormData({ ...formData, LineaId: e.target.value })}
                                    disabled={!formData.PlanId}
                                >
                                    <option value="">Seleccione Linea...</option>
                                    {lineaOptions.map((linea) => (
                                        <option key={linea.id} value={linea.id}>
                                            {linea.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={3} className="justify-content-end mt-2 d-flex gap-2">
                            <Button variant="primary" onClick={() => handleModalDetail()}>
                                Detalles Plan
                            </Button>

                            <Button variant="warning" onClick={() => handlePlanHistory(engagementId)}>
                                Historico Plan
                            </Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-start align-items-center">
                        {/* Campo de texto Comentarios */}
                        <Col xs={12} md={12} className="mb-3">
                            <TextField
                                label="Comentarios"
                                placeholder="Escribe tus comentarios"
                                multiline
                                rows={3}
                                fullWidth
                                value={comentarios}
                                onChange={(e) => setComentarios(e.target.value)}
                                required
                            />
                        </Col>
                        {/* Campo de texto Teléfono */}
                        <Col xs={12} md={6} className="mb-3">
                            <TextField
                                label="Teléfono"
                                placeholder="Escribe tu teléfono"
                                fullWidth
                                value={cellPhone}
                                onChange={(e) => setCellPhone(e.target.value)}
                                type="number"
                                inputProps={{ min: 0 }}
                                required
                            />
                        </Col>
                        {/* Sección para los botones alineados a la derecha */}
                        <Col xs={12} md={6} className="justify-content-end d-flex gap-2">
                            <Button
                                variant="success"
                                disabled={!isSaveEnabled()}
                                onClick={handleSaveInformationUser}
                            >
                                Guardar
                            </Button>

                            <Button
                                variant="danger"
                                onClick={() => handlePlanToReport()}>
                                Generar Plan
                            </Button>
                        </Col>
                    </Row>

                    {isLoading && (
                        <div className="overlay">
                            <div><Spinner animation="border" variant="success" /></div>
                            <br/>
                            <div className="loader">Cargando...</div>
                        </div>
                    )}

                    <Row className="justify-content-end">
                        {/* Sección de Autorización */}
                        <Col md={5}>
                            {isValidUserData() && (
                                <AuthorizationSection
                                    component={ComponentEnum.RENEGOTIATION}
                                    userData={userData}
                                    wide={12}
                                />
                            )}
                        </Col>

                        {/* Sección de Botones para Subir/Ver Archivos */}
                        <Col md={7} className="d-flex flex-column gap-3 mt-4">
                            {/* Sección 1: Plan Firmado */}
                            <Row className="d-flex flex-row flex-wrap justify-content-end gap-2">
                                <Col xs={6} md={4} className="d-flex justify-content-center">
                                    <Button variant="secondary" className="w-100 py-1" onClick={() => handleShowConfirmationModal(engagementId, 'acuerdo')}>
                                        Subir Plan Firmado
                                    </Button>
                                </Col>
                                <Col xs={6} md={4} className="d-flex justify-content-center">
                                    <Button variant="info" className="w-100 py-1" onClick={() => handleDownload(engagementId, "acuerdo")}>
                                        <FaEye className="me-2" /> Ver Plan Firmado
                                    </Button>
                                </Col>
                            </Row>

                            {/* Sección 2: Legalización */}
                            <Row className="d-flex flex-row flex-wrap justify-content-end gap-2">
                                <Col xs={6} md={4} className="d-flex justify-content-center">
                                    <Button variant="secondary" className="w-100 py-1" onClick={() => handleShowConfirmationModal(engagementId, 'legalizacion')}>
                                        Subir Legalización
                                    </Button>
                                </Col>
                                <Col xs={6} md={4} className="d-flex justify-content-center">
                                    <Button variant="info" className="w-100 py-1" onClick={() => handleDownload(engagementId, "legalizacion")}>
                                        <FaEye className="me-2" /> Ver Legalización
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Aquí renderizas el componente pero lo ocultas */}
            <div style={{ display: 'none' }}>
                {isReadyToPrintPlan && engagement && (
                    <div ref={planRef}>
                        <PlanInversion engagement={engagement} />
                    </div>
                )}
            </div>

            {/* Modal para detalles de la línea */}
            <LineDetailModal show={showModalLineDatail} handleClose={handleCloseModal} userData={userData} planData={lineDetailData} />

            {/* Modal Historicos */}
            <PlanHistory show={showModalPlanHistory} handleClose={handleCloseModal} data={planHistoryData} />

            {/* Modal de Confirmación */}
            <ConfirmationModal show={showModalConfirmation} onConfirm={handleConfirmUpload} onClose={handleCloseModal} />
        </>
    )

}
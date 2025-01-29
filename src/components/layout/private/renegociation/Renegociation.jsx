import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import printJS from "print-js";
import {Button, Col, Container, Row, Form, Spinner} from "react-bootstrap";
import { TextField } from "@mui/material";
import { FaEye } from "react-icons/fa";

//Services
import { userService } from "../../../../helpers/services/UserServices";
import { renegotiationServices } from "../../../../helpers/services/RenegociationServices";

//Components
import AlertComponent from "../../../../helpers/alert/AlertComponent";
import { UserInformation } from "../user-information/UserInformation";
import { PlanInversion } from "./plan/PlanInversion";
import { LineDetail } from "../../shared/Modals/LineDetail";

//Enum
import { ResponseStatusEnum } from "../../../../helpers/GlobalEnum";

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
    const [planFirmado, setPlanFirmado] = useState(null);
    const [legalizacion, setLegalizacion] = useState(null);
    const [isReadyToPrintPlan, setIsReadyToPrintPlan] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [lineDetailData, setLineDetailData] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const getUserInformation = async (cubId) => {
        try {
            const { data, status} = await userService.userInformation(cubId);
            if(status === ResponseStatusEnum.OK) {
                setUserData(data);
                setEngagementId(data?.cub_id);
            }
        } catch (error) {
            console.log(error);
            showError(error, 'Error buscando el usuario');
        }
    }

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

    // Lógica para habilitar/deshabilitar el botón de guardar
    const isSaveEnabled = comentarios || cellPhone || (formData.LineaId && formData.PlanId);

    //
    const showAlert = (title, message) => {
        AlertComponent.success(title, message)
    };

    //
    const showError = (title, message) => {
        AlertComponent.error(title, message);
    };

    const handleSaveInformationUser = async () => {
        let updateData = {
            plan: formData.PlanId,
            linea: formData.LineaId,
            telefono: cellPhone,
            comentario: comentarios
        }
        console.log('save: ', updateData);
        try {
            const {data, status} = await renegotiationServices.updateUserInformationRenegotiation(params.cub_id, updateData);
            console.log('status: ', status);
            console.log('data: ', data);
            if(status === ResponseStatusEnum.NOT_FOUND) {
                showError('error', data.detail);
            }

            if(status === ResponseStatusEnum.OK) {

            }
        } catch (error) {
            console.log(error);
            showError(error, 'Error al actualizar la información');
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
        try {
            const {data, status} = await renegotiationServices.getDetailPlan(engagementId);
            if (status === ResponseStatusEnum.OK) {
                setLineDetailData(data);
                setShowModal(true);
            }
        } catch (error) {
            console.log(error);
            showError(error, 'Error buscando el detalle');
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setLineDetailData('');
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
              font-size: 12px;
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

            try {
                const { status } = await renegotiationServices.sendEngagement(cubId, formData);

                if (status === ResponseStatusEnum.CREATE) {
                    showAlert('Éxito', 'Archivo enviado exitosamente');
                    window.location.reload();
                }

                if (status === ResponseStatusEnum.BAD_REQUEST ||
                    status === ResponseStatusEnum.INTERNAL_SERVER_ERROR ||
                    status !== ResponseStatusEnum.CREATE) {
                    showError('Error', 'Error al enviar el archivo');
                }
            } catch (error) {
                console.error("Error al enviar el archivo:", error);
                showError('Error', 'Error al enviar el archivo');
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
                            />
                        </Col>

                        {/* Campo de texto telefono */}
                        <Col xs={12} md={6} className="mb-3">
                            <TextField
                                label="Telefono"
                                placeholder="Escribe tus tenefono"
                                fullWidth
                                value={cellPhone}
                                onChange={(e) => setCellPhone(e.target.value)}
                                type="number"
                                inputProps={{ min: 0 }}
                            />
                        </Col>

                        {/* Select para Plan */}
                        <Col xs={12} md={6} className="mb-3">
                            <Form.Group>
                                <Form.Select
                                    name="PlanId"
                                    value={formData.PlanId}
                                    onChange={async (e) => {
                                        const planId = e.target.value;
                                        setFormData({ ...formData, PlanId: planId, LineaId: "" }); // Resetear Línea
                                        const { data } = await renegotiationServices.getLine(planId);
                                        setLineaOptions(data);
                                    }}
                                >
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
                                <Form.Select
                                    name="LineaId"
                                    value={formData.LineaId}
                                    onChange={(e) =>
                                        setFormData({ ...formData, LineaId: e.target.value })
                                    }
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
                    </Row>

                    {isLoading && (
                        <div className="overlay">
                            <div><Spinner animation="border" variant="success" /></div>
                            <br/>
                            <div className="loader">Cargando...</div>
                        </div>
                    )}

                    <Row className="justify-content-end">
                        {/* Botón de guardar */}
                        <Col xs={12} md="auto" className="mb-2">
                            <Button
                                variant="success"
                                disabled={!isSaveEnabled}
                                onClick={handleSaveInformationUser}
                                className="w-100" // Asegura que ocupe el ancho completo en pantallas pequeñas
                            >
                                Guardar
                            </Button>
                        </Col>

                        {/* Generar Plan */}
                        <Col xs={12} md="auto" className="mb-2">
                            <Button
                                variant="secondary"
                                onClick={() => handlePlanToReport()}
                                className="w-100"
                            >
                                Generar Plan
                            </Button>
                        </Col>

                        {/* Detalles del Plan */}
                        <Col xs={12} md="auto" className="mb-2">
                            <Button
                                variant="info"
                                onClick={() => handleModalDetail()}
                                className="w-100"
                            >
                                Detalles Plan
                            </Button>
                        </Col>
                    </Row>

                    {/* Nueva sección para subir archivos */}
                    <Row className="justify-content-start align-items-center mt-4">
                        {/* Subir Plan Firmado */}
                        <Col xs={6} md={2} className="mb-3">
                            <Button
                                variant="secondary"
                                onClick={() => handleUploadFile(engagementId, 'acuerdo')}
                            >
                                Subir Plan Firmado
                            </Button>
                        </Col>

                        {/* Ver Plan Firmado */}
                        <Col xs={6} md={4} className="mb-3">
                            <Button
                                variant="info"
                                onClick={() => handleDownload(engagementId, "acuerdo")}
                            >
                                <FaEye className="me-2" /> Ver Plan Firmado
                            </Button>
                        </Col>

                        {/* Subir Legalización */}
                        <Col xs={6} md={2} className="mb-3">
                            <Button
                                variant="secondary"
                                onClick={() => handleUploadFile(engagementId, 'legalizacion')}
                            >
                                Subir Legalización
                            </Button>
                        </Col>

                        {/* Ver Legalización */}
                        <Col xs={6} md={4} className="mb-3">
                            <Button
                                variant="info"
                                onClick={() => handleDownload(engagementId, "legalizacion")}
                            >
                                <FaEye className="me-2" /> Ver Legalización
                            </Button>
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
            <LineDetail show={showModal} handleClose={handleCloseModal} data={lineDetailData} />
        </>
    )

}
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import printJS from "print-js";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
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

    const getUserInformation = async (cubId) => {
        try {
            const { data, status} = await userService.userInformation(cubId);
            if(status === ResponseStatusEnum.OK) {
                setUserData(data);
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

    const handlePlanToReport = () => {
        setIsReadyToPrintPlan(true);
    }

    const handleModalDetail = () => {
        setLineDetailData('Detalle');
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false); // Cerrar el modal
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

    useEffect(() => {
        if (params.cub_id) {
            getUserInformation(params.cub_id);
        }
        getPlans();
    }, [params.cub_id]);

    useEffect(() => {
        if (isReadyToPrintPlan) {
            handlePrintPlan();
            setIsReadyToPrintPlan(false); // Restablecer el estado
        }

    },[isReadyToPrintPlan]);

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
                                onClick={() => {
                                    document.getElementById("uploadPlanFirmado").click();
                                }}
                            >
                                Subir Plan Firmado
                            </Button>
                            <input
                                type="file"
                                id="uploadPlanFirmado"
                                style={{ display: "none" }}
                                onChange={(e) => setPlanFirmado(e.target.files[0])}
                            />
                        </Col>
                        {/* Ver Plan Firmado */}
                        <Col xs={6} md={4} className="mb-3">
                            <Button
                                variant="info"
                                disabled={!planFirmado}
                                onClick={() => {
                                    if (planFirmado) {
                                        const url = URL.createObjectURL(planFirmado);
                                        window.open(url, "_blank");
                                    }
                                }}
                            >
                                <FaEye className="me-2" /> Ver Plan Firmado
                            </Button>
                        </Col>

                        {/* Subir Legalización */}
                        <Col xs={6} md={2} className="mb-3">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    document.getElementById("uploadLegalizacion").click();
                                }}
                            >
                                Subir Legalización
                            </Button>
                            <input
                                type="file"
                                id="uploadLegalizacion"
                                style={{ display: "none" }}
                                onChange={(e) => setLegalizacion(e.target.files[0])}
                            />
                        </Col>
                        {/* Ver Legalización */}
                        <Col xs={6} md={4} className="mb-3">
                            <Button
                                variant="info"
                                disabled={!legalizacion}
                                onClick={() => {
                                    if (legalizacion) {
                                        const url = URL.createObjectURL(legalizacion);
                                        window.open(url, "_blank");
                                    }
                                }}
                            >
                                <FaEye className="me-2" /> Ver Legalización
                            </Button>
                        </Col>
                    </Row>

                </Container>
            </div>

            {/* Aquí renderizas el componente pero lo ocultas */}
            <div style={{ display: 'none' }}>
                {isReadyToPrintPlan && (
                    <div ref={planRef}>
                        <PlanInversion data={''} />
                    </div>
                )}
            </div>

            {/* Modal para detalles de la línea */}
            <LineDetail show={showModal} handleClose={handleCloseModal} data={lineDetailData} />
        </>
    )

}
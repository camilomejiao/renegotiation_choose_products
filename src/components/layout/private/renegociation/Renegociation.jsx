import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import {UserInformation} from "../user-information/UserInformation";
import {userService} from "../../../../helpers/services/UserServices";
import {ResponseStatusEnum} from "../../../../helpers/GlobalEnum";
import AlertComponent from "../../../../helpers/alert/AlertComponent";
import {Button, Col, Container, Row} from "react-bootstrap";
import Select from "react-select";
import {TextField} from "@mui/material";
import {FaEye} from "react-icons/fa";


export const Renegociation = () => {

    const params = useParams();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({});
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedLinea, setSelectedLinea] = useState(null);
    const [observaciones, setObservaciones] = useState("");
    const [comentarios, setComentarios] = useState("");
    const [planFirmado, setPlanFirmado] = useState(null);
    const [legalizacion, setLegalizacion] = useState(null);


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

    // Opciones de los planes y líneas
    const planOptions = [
        { value: "agricola", label: "Agrícola" },
        { value: "pecuarios", label: "Pecuarios" },
        { value: "noPecuarios", label: "No Pecuarios" },
    ];

    const lineaOptions = {
        agricola: [
            { value: "cultivos", label: "Cultivos" },
            { value: "siembra", label: "Siembra" },
        ],
        pecuarios: [
            { value: "ganaderia", label: "Ganadería" },
            { value: "avicultura", label: "Avicultura" },
        ],
        noPecuarios: [
            { value: "industria", label: "Industria" },
            { value: "comercio", label: "Comercio" },
        ],
    };

    // Lógica para habilitar/deshabilitar el botón de guardar
    const isSaveEnabled = selectedPlan && selectedLinea;

    //
    const showAlert = (title, message) => {
        AlertComponent.success(title, message)
    };

    //
    const showError = (title, message) => {
        AlertComponent.error(title, message);
    };

    useEffect(() => {
        if (params.cub_id) {
            getUserInformation(params.cub_id);
        }
    }, [params.cub_id]);

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
                        <Col xs={12} md={6} className="mb-3">
                            <Select
                                value={selectedPlan}
                                onChange={(selectedOption) => {
                                    setSelectedPlan(selectedOption);
                                    setSelectedLinea(null); // Reiniciar línea cuando se cambia el plan
                                }}
                                options={planOptions}
                                placeholder="Selecciona un Plan"
                                classNamePrefix="custom-select"
                                className="custom-select w-100"
                            />
                        </Col>

                        {/* Select para Línea */}
                        <Col xs={12} md={6} className="mb-3">
                            <Select
                                value={selectedLinea}
                                onChange={setSelectedLinea}
                                options={selectedPlan ? lineaOptions[selectedPlan.value] : []}
                                placeholder="Selecciona una Línea"
                                classNamePrefix="custom-select"
                                className="custom-select w-100"
                                isDisabled={!selectedPlan} // Deshabilitado si no hay un plan seleccionado
                            />
                        </Col>

                        {/* Campo de texto Observaciones */}
                        <Col xs={12} md={6} className="mb-3">
                            <TextField
                                label="Observaciones"
                                placeholder="Escribe tus observaciones"
                                multiline
                                rows={3}
                                fullWidth
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                            />
                        </Col>

                        {/* Campo de texto Comentarios */}
                        <Col xs={12} md={6} className="mb-3">
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

                        {/* Botón de guardar */}
                        <Col xs={6} md={12} className="text-end">
                            <Button
                                variant="primary"
                                disabled={!isSaveEnabled} // Habilitado sólo si Plan y Línea tienen valores
                                onClick={() => {
                                    alert("Datos guardados");
                                    // Aquí iría la lógica para guardar los datos
                                }}
                            >
                                Guardar
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
        </>
    )

}
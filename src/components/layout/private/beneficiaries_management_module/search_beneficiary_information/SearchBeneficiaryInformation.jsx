import { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
import imgDCSIPeople from "../../../../../assets/image/addProducts/people1.jpg";
import imgAdd from "../../../../../assets/image/payments/imgPay.png";
import { Card, Form, Row, Col, Button, Spinner, Container } from "react-bootstrap";
//
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
// import { beneficiaryServices } from "../../../../../helpers/services/BeneficiaryServices"; // <-- cuando lo tengas

const initialValues = {
    identification: "",
    cub: "",
    first_name: "",
    last_name: "",
};

const onlyNumbersRegex = /^\d*$/; // permite vacío o solo dígitos
const onlyTextRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/; // letras + espacios

const validationSchema = yup.object().shape({
    identification: yup
        .string()
        .matches(onlyNumbersRegex, "Solo debes agregar números")
        .notRequired(),

    cub: yup
        .string()
        .matches(onlyNumbersRegex, "Solo debes agregar números")
        .notRequired(),

    first_name: yup
        .string()
        .matches(onlyTextRegex, "Solo debes agregar texto")
        .notRequired(),

    last_name: yup
        .string()
        .matches(onlyTextRegex, "Solo debes agregar texto")
        .notRequired(),
});

export const SearchBeneficiaryInformation = () => {
    const [loading, setLoading] = useState(false);
    const [beneficiaryInfo, setBeneficiaryInfo] = useState(null);
    const [movements, setMovements] = useState([]);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const { identification, cub, first_name, last_name } = values;

            // Validación al menos un campo
            if (
                !identification.trim() &&
                !cub.trim() &&
                !first_name.trim() &&
                !last_name.trim()
            ) {
                AlertComponent.warning("Debe diligenciar al menos un campo para buscar.");
                return;
            }

            try {
                setLoading(true);
                // Aquí llamas tu servicio real:
                // const { data, status } = await beneficiaryServices.searchBeneficiary(values);
                // if (status === ResponseStatusEnum.OK) { ... }

                // 🔹 MOCK de ejemplo mientras conectas el servicio:
                const mockBeneficiary = {
                    nombre_completo: "JUAN PÉREZ",
                    identificacion: identification || "123456789",
                    cub: cub || "800123",
                    departamento: "NARIÑO",
                    municipio: "SAN ANDRÉS DE TUMACO",
                    vereda: "EL PARAÍSO",
                };

                const mockMovements = [
                    {
                        id: 1,
                        fecha: "2025-11-10",
                        tipo: "Entrega de productos",
                        detalle: "Kit agrícola - Lote 1",
                        valor: 1500000,
                    },
                    {
                        id: 2,
                        fecha: "2025-11-20",
                        tipo: "Entrega de productos",
                        detalle: "Kit pecuario - Lote 2",
                        valor: 3200000,
                    },
                ];

                setBeneficiaryInfo(mockBeneficiary);
                setMovements(mockMovements);
            } catch (error) {
                console.error(error);
                AlertComponent.error("Error al buscar la información del beneficiario.");
            } finally {
                setLoading(false);
            }
        },
    });

    const handleClear = () => {
        formik.resetForm();
        setBeneficiaryInfo(null);
        setMovements([]);
    };

    const handleExport = () => {
        if (!beneficiaryInfo) {
            AlertComponent.warning("Primero realice una búsqueda para exportar la información.");
            return;
        }
        // Aquí implementas tu lógica real de exportación (Excel, PDF, etc.)
        console.log("Exportar información de: ", beneficiaryInfo, movements);
        AlertComponent.success("Exportación generada (mock).");
    };

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgDCSIPeople}
                    titleHeader={"Busqueda de beneficiarios"}
                    bannerIcon={imgAdd}
                    backgroundIconColor={"#2148C0"}
                    bannerInformation={""}
                    backgroundInformationColor={"#1ff675"}
                />

                {/* Card de búsqueda */}
                <Container>
                    <Card className="mt-4 shadow-sm">
                        <Card.Body>
                            <h4 className="mb-4 text-primary fw-bold text-center text-md-start">Búsqueda de beneficiario</h4>

                            <Form onSubmit={formik.handleSubmit}>
                                <Row className="g-3">
                                    <Col md={3} xs={12}>
                                        <Form.Label>Cédula</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="identification"
                                            value={formik.values.identification}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.identification && !!formik.errors.identification}
                                            placeholder="Ingrese cédula"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.identification}
                                        </Form.Control.Feedback>
                                    </Col>

                                    <Col md={3} xs={12}>
                                        <Form.Label>CUB</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cub"
                                            value={formik.values.cub}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.cub && !!formik.errors.cub}
                                            placeholder="Ingrese CUB"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.cub}
                                        </Form.Control.Feedback>
                                    </Col>

                                    <Col md={3} xs={12}>
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="first_name"
                                            value={formik.values.first_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.first_name && !!formik.errors.first_name}
                                            placeholder="Ingrese nombre"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.first_name}
                                        </Form.Control.Feedback>
                                    </Col>

                                    <Col md={3} xs={12}>
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="last_name"
                                            value={formik.values.last_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.last_name && !!formik.errors.last_name}
                                            placeholder="Ingrese apellido"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.last_name}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-start gap-2 mt-4">
                                    <Button
                                        variant="outline-primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    size="sm"
                                                    animation="border"
                                                    className="me-2"
                                                />
                                                Buscando...
                                            </>
                                        ) : (
                                            "Buscar"
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        type="button"
                                        onClick={handleClear}
                                        disabled={loading}
                                    >
                                        Limpiar búsqueda
                                    </Button>

                                    <Button
                                        variant="outline-success"
                                        type="button"
                                        onClick={handleExport}
                                        disabled={loading || !beneficiaryInfo}
                                    >
                                        Exportar
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Card de información básica del beneficiario */}
                    {beneficiaryInfo && (
                        <Card className="mt-4 shadow-sm">
                            <Card.Body>
                                <h4 className="mb-4 text-primary fw-bold text-center text-md-start">Información básica del beneficiario</h4>
                                <Row className="mt-3">
                                    <Col md={6}>
                                        <p>
                                            <strong>Nombre completo: </strong>
                                            {beneficiaryInfo.nombre_completo}
                                        </p>
                                        <p>
                                            <strong>Cédula: </strong>
                                            {beneficiaryInfo.identificacion}
                                        </p>
                                        <p>
                                            <strong>CUB: </strong>
                                            {beneficiaryInfo.cub}
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <p>
                                            <strong>Departamento: </strong>
                                            {beneficiaryInfo.departamento}
                                        </p>
                                        <p>
                                            <strong>Municipio: </strong>
                                            {beneficiaryInfo.municipio}
                                        </p>
                                        <p>
                                            <strong>Vereda: </strong>
                                            {beneficiaryInfo.vereda}
                                        </p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Card de movimientos del beneficiario */}
                    {beneficiaryInfo && (
                        <Card className="mt-4 mb-4 shadow-sm">
                            <Card.Body>
                                <Card.Title>Movimientos del beneficiario</Card.Title>

                                {movements.length === 0 ? (
                                    <p className="mt-3">No se encontraron movimientos para este beneficiario.</p>
                                ) : (
                                    <div className="mt-3">
                                        {movements.map((mov) => (
                                            <Card key={mov.id} className="mb-2 border-0 border-start border-3 border-primary">
                                                <Card.Body className="py-2">
                                                    <Row>
                                                        <Col md={3}>
                                                            <strong>Fecha:</strong> {mov.fecha}
                                                        </Col>
                                                        <Col md={3}>
                                                            <strong>Tipo:</strong> {mov.tipo}
                                                        </Col>
                                                        <Col md={4}>
                                                            <strong>Detalle:</strong> {mov.detalle}
                                                        </Col>
                                                        <Col md={2} className="text-end">
                                                            <strong>Valor: </strong>
                                                            {mov.valor.toLocaleString("es-CO", {
                                                                style: "currency",
                                                                currency: "COP",
                                                            })}
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </Container>

            </div>
        </>
    );
};

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Card, Col, Row } from "react-bootstrap";
import { FaSave, FaStepBackward } from "react-icons/fa";

// Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";

// Enums
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import imgWorker from "../../../../../../assets/image/payments/worker.png";

export const CreateCollectionAccount = () => {
    const navigate = useNavigate();

    const [formFields, setFormFields] = useState({
        tipoCuenta: '',
        numeroCuenta: '',
        entidadBancaria: '',
        certificadoBancario: null,
        rut: null,
        detalleCuenta: null
    });

    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendingData, setSendingData] = useState(false);

    const statusCollectionAccountColumns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "cub_id", headerName: "Cub", width: 90 },
        { field: "name", headerName: "Beneficiario", width: 300 },
        { field: "identification", headerName: "Identificacion", width: 200 },
        { field: "date", headerName: "Fecha", width: 150 },
        { field: "amount", headerName: "Cantidad de Productos", width: 150 },
        { field: "amount_of_money", headerName: "Valor", width: 150 },
    ];

    const getApprovedDeliveries = async (pageToFetch = 1, sizeToFetch) => {
        setLoading(true);
        try {
            const { data, status } = await paymentServices.getAllApprovedDeliveriesBySupplier(pageToFetch, sizeToFetch);
            if (status === ResponseStatusEnum.OK) {
                const rows = normalizeRows(data.results);
                setDataTable(rows);
                setRowCount(data.count);
            }
        } catch (error) {
            console.error("Error cargando entregas aprobadas:", error);
        } finally {
            setLoading(false);
        }
    };

    const normalizeRows = (data) => {
        return data.map((row) => ({
            id: row?.id,
            cub_id: row?.beneficiario?.id,
            name: `${row?.beneficiario?.nombre ?? ''} ${row?.beneficiario?.apellido ?? ''}`,
            identification: row?.beneficiario?.identificacion,
            date: row?.fecha_creacion.split('T')[0],
            amount: row?.cantidad_productos,
            amount_of_money: parseFloat(row?.valor).toLocaleString('es-CO')
        }));
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedIds(newSelection);
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        console.log(name, files);
        setFormFields({ ...formFields, [name]: files[0] });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormFields({ ...formFields, [name]: value });
    };

    const handleSaveUsers = async () => {
        console.log(formFields.tipoCuenta, formFields.numeroCuenta, formFields.entidadBancaria, formFields.certificadoBancario, formFields.rut, formFields.detalleCuenta);
        if (
            !formFields.tipoCuenta ||
            !formFields.numeroCuenta ||
            !formFields.entidadBancaria ||
            !formFields.certificadoBancario ||
            !formFields.rut ||
            !formFields.detalleCuenta
        ) {
            AlertComponent.error("Error", "Todos los campos del formulario son obligatorios.");
            return;
        }

        if (selectedIds.length === 0) {
            AlertComponent.error("Error", "Debe seleccionar al menos una entrega.");
            return;
        }

        const formData = new FormData();
        formData.append("tipo_cuenta", formFields.tipoCuenta);
        formData.append("numero_cuenta", formFields.numeroCuenta);
        formData.append("entidad_bancaria", formFields.entidadBancaria);
        formData.append("certificado_bancario_pdf", formFields.certificadoBancario);
        formData.append("rut_pdf", formFields.rut);
        formData.append("solicitud_cuenta_pdf", formFields.detalleCuenta);

        selectedIds.forEach(id => {
            formData.append("entregas_ids", id);
        });

        console.log(formData);

        try {
            setSendingData(true);
            const { status } = await paymentServices.createCollectionAccounts(formData);
            if (status === ResponseStatusEnum.CREATED) {
                AlertComponent.success("Éxito", "Cuenta de cobro creada exitosamente.");
                navigate('/admin/payments-suppliers');
            }
        } catch (error) {
            console.error("Error al crear cuenta de cobro:", error);
            AlertComponent.error("Error", "Hubo un problema al crear la cuenta de cobro.");
        } finally {
            setSendingData(false);
        }
    };

    const onBack = () => navigate(`/admin/payments-suppliers`);

    useEffect(() => {
        getApprovedDeliveries(page + 1, pageSize);
    }, [page, pageSize]);

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Proceso de pago'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás revisar el estado de tus órdenes de pago.'}
                backgroundInformationColor={'#F66D1F'}
            />

            <div className="supplier-header">
                <div className="supplier-content">
                    <h2>Proveedor</h2>
                    <img src={imgWorker} alt="Proveedor" className="supplier-img" />
                </div>
            </div>

            <div className="container mt-lg-5">
                {sendingData && (
                    <div className="overlay">
                        <div className="loader">Enviando informacion...</div>
                    </div>
                )}

                <Card className="p-3 p-md-4 shadow-sm mb-4">
                    <h4 className="mb-4 text-primary fw-bold text-center text-md-start">Información para Cuenta de Cobro</h4>

                    {/* Inputs de texto */}
                    <Row className="gy-3">
                        <Col xs={12} sm={6} md={4}>
                            <label className="form-label fw-semibold">Tipo de cuenta <span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                name="tipoCuenta"
                                value={formFields.tipoCuenta}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione...</option>
                                <option value="AHO">Ahorros</option>
                                <option value="COR">Corriente</option>
                            </select>
                        </Col>
                        <Col xs={12} sm={6} md={4}>
                            <label className="form-label fw-semibold">Número de cuenta <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="numeroCuenta"
                                value={formFields.numeroCuenta}
                                onChange={handleInputChange}
                                placeholder="Ej: 1234567890"
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <label className="form-label fw-semibold">Entidad bancaria <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="entidadBancaria"
                                value={formFields.entidadBancaria}
                                onChange={handleInputChange}
                                placeholder="Ej: Banco Agrario"
                            />
                        </Col>
                    </Row>

                    {/* Archivos PDF */}
                    <Row className="gy-3 mt-3 mb-4">
                        <Col xs={12} sm={6} md={4}>
                            <label className="form-label fw-semibold">Certificado de cuenta bancaria (PDF) <span className="text-danger">*</span></label>
                            <input
                                type="file"
                                className="form-control"
                                name="certificadoBancario"
                                onChange={handleFileChange}
                                accept="application/pdf"
                            />
                        </Col>
                        <Col xs={12} sm={6} md={4}>
                            <label className="form-label fw-semibold">RUT (PDF) <span className="text-danger">*</span></label>
                            <input
                                type="file"
                                className="form-control"
                                name="rut"
                                onChange={handleFileChange}
                                accept="application/pdf"
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <label className="form-label fw-semibold">Detalle cuenta de cobro (PDF) <span className="text-danger">*</span></label>
                            <input
                                type="file"
                                className="form-control"
                                name="detalleCuenta"
                                onChange={handleFileChange}
                                accept="application/pdf"
                            />
                        </Col>
                    </Row>

                    <div style={{ height: 500, width: "100%" }}>
                        <DataGrid
                            checkboxSelection
                            rows={dataTable}
                            columns={statusCollectionAccountColumns}
                            loading={loading}
                            paginationMode="server"
                            rowCount={rowCount}
                            pageSizeOptions={[50, 100]}
                            paginationModel={{ page, pageSize }}
                            onPaginationModelChange={({ page, pageSize }) => {
                                setPage(page);
                                setPageSize(pageSize);
                            }}
                            onRowSelectionModelChange={handleSelectionChange}
                            sx={{
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#40A581",
                                    color: "white",
                                    fontSize: "14px",
                                },
                                "& .MuiDataGrid-columnHeader": {
                                    textAlign: "center",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                },
                                "& .MuiDataGrid-container--top [role=row], .MuiDataGrid-container--bottom [role=row]": {
                                    backgroundColor: "#40A581 !important",
                                    color: "white !important",
                                },
                                "& .MuiDataGrid-cell": {
                                    fontSize: "14px",
                                    textAlign: "center",
                                    justifyContent: "center",
                                    display: "flex",
                                },
                                "& .MuiDataGrid-row:hover": {
                                    backgroundColor: "#E8F5E9",
                                },
                            }}
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="secondary" size="md" onClick={onBack}>
                            <FaStepBackward /> Atras
                        </Button>
                        <Button variant="success" size="md" onClick={handleSaveUsers}>
                            <FaSave /> Crear cuenta de cobro
                        </Button>
                    </div>

                </Card>

            </div>
        </>
    );
};
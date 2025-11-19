import { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { FaSave, FaStepBackward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";

// Enums
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgWorker from "../../../../../../assets/image/payments/worker.png";
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";
import { Breadcrumb } from "../../../../../shared/Breadcrumb";
import { ModernBanner } from "../../../../../shared/ModernBanner";
import StandardTable from "../../../../../shared/StandardTable";

export const CreateCollectionAccount = () => {
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    tipoCuenta: "",
    numeroCuenta: "",
    entidadBancaria: "",
    certificadoBancario: null,
    rut: null,
  });

  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [rowCount, setRowCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingData, setSendingData] = useState(false);

  const statusCollectionAccountColumns = [
    {
      field: "id",
      headerName: "ID",
      width: 85,
      align: "right",
      headerAlign: "left",
    },
    {
      field: "cub_id",
      headerName: "CUB",
      width: 90,
      align: "right",
      headerAlign: "left",
    },
    {
      field: "name",
      headerName: "BENEFICIARIO",
      width: "auto",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "identification",
      headerName: "IDENTIFICACIÓN",
      width: "auto",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "date",
      headerName: "FECHA",
      width: 150,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "amount",
      headerName: "CANTIDAD DE PRODUCTOS",
      width: 150,
      align: "right",
      headerAlign: "left",
    },
    {
      field: "amount_of_money",
      headerName: "VALOR",
      width: "auto",
      align: "left",
      headerAlign: "left",
    },
  ];

  const normalizeRows = useCallback((data) => {
    return data.map((row) => ({
      id: row?.id,
      cub_id: row?.beneficiario?.id,
      name: `${row?.beneficiario?.nombre ?? ""} ${
        row?.beneficiario?.apellido ?? ""
      }`,
      identification: row?.beneficiario?.identificacion,
      date: row?.fecha_creacion.split("T")[0],
      amount: row?.cantidad_productos,
      amount_of_money: parseFloat(row?.valor).toLocaleString("es-CO"),
    }));
  }, []);

  const getApprovedDeliveries = useCallback(
    async (pageToFetch = 1, sizeToFetch = 100) => {
      setLoading(true);
      try {
        const { data, status } =
          await paymentServices.getAllApprovedDeliveriesBySupplier(
            pageToFetch,
            sizeToFetch
          );
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
    },
    [normalizeRows]
  );

  const handleSelectionChange = (newSelection) => {
    setSelectedIds(newSelection);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormFields({ ...formFields, [name]: files[0] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSaveUsers = async () => {
    if (
      !formFields.tipoCuenta ||
      !formFields.numeroCuenta ||
      !formFields.entidadBancaria ||
      !formFields.certificadoBancario ||
      !formFields.rut
    ) {
      AlertComponent.error(
        "Error",
        "Todos los campos del formulario son obligatorios."
      );
      return;
    }

    if (selectedIds.length === 0) {
      AlertComponent.error("Error", "Debe seleccionar al menos una entrega.");
      return;
    }

    if (selectedIds.length > 25) {
      AlertComponent.info(
        "Error",
        "Solo puedes seleccionar 25 entregas por cuenta de cobro."
      );
      return;
    }

    const formData = new FormData();
    formData.append("tipo_cuenta", formFields.tipoCuenta);
    formData.append("numero_cuenta", formFields.numeroCuenta);
    formData.append("entidad_bancaria", formFields.entidadBancaria);
    formData.append("certificado_bancario_pdf", formFields.certificadoBancario);
    formData.append("rut_pdf", formFields.rut);
    formData.append("entregas_ids", selectedIds.join(","));

    try {
      setSendingData(true);
      const { status } = await paymentServices.createCollectionAccounts(
        formData
      );
      if (status === ResponseStatusEnum.CREATED) {
        AlertComponent.success("Éxito", "Cuenta de cobro creada exitosamente.");
        navigate("/admin/payments-suppliers");
      }
    } catch (error) {
      console.error("Error al crear cuenta de cobro:", error);
      AlertComponent.error(
        "Error",
        "Hubo un problema al crear la cuenta de cobro."
      );
    } finally {
      setSendingData(false);
    }
  };

  const onBack = () => navigate(`/admin/payments-suppliers`);

  useEffect(() => {
    getApprovedDeliveries(page + 1, pageSize);
  }, [getApprovedDeliveries, page, pageSize]);

  return (
    <>
      <Breadcrumb />
      <div className="container-fluid px-4">
        <ModernBanner
          imageHeader={imgPayments}
          titleHeader="​"
          bannerIcon={imgAdd}
          bannerInformation="Crear Cuenta de Cobro"
          backgroundInformationColor="#2148C0"
          infoText="Complete la información bancaria y seleccione las entregas aprobadas para crear su cuenta de cobro."
        />

        {sendingData && (
          <div className="overlay">
            <div className="loader">Enviando informacion...</div>
          </div>
        )}

        <Card className="p-3 p-md-4 shadow-sm mb-4">
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img
                src={imgWorker}
                alt="Proveedor"
                style={{ width: "32px", height: "32px" }}
              />
              <h3 className="card-title">Panel de Proveedor</h3>
            </div>
          </div>
          <div className="card-body">
            <h4 className="mb-4 text-primary fw-bold text-center text-md-start">
              Información para Cuenta de Cobro
            </h4>

            {/* Inputs de texto */}
            <Row className="gy-3">
              <Col xs={12} sm={6} md={4}>
                <label className="form-label fw-semibold">
                  Tipo de cuenta <span className="text-danger">*</span>
                </label>
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
                <label className="form-label fw-semibold">
                  Número de cuenta <span className="text-danger">*</span>
                </label>
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
                <label className="form-label fw-semibold">
                  Entidad bancaria <span className="text-danger">*</span>
                </label>
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
                <label className="form-label fw-semibold">
                  Certificado de cuenta bancaria (PDF){" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="certificadoBancario"
                  onChange={handleFileChange}
                  accept="application/pdf"
                />
              </Col>
              <Col xs={12} sm={6} md={4}>
                <label className="form-label fw-semibold">
                  RUT (PDF) <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="rut"
                  onChange={handleFileChange}
                  accept="application/pdf"
                />
              </Col>
            </Row>

            <StandardTable
              rows={dataTable}
              columns={statusCollectionAccountColumns}
              loading={loading}
              customProps={{
                checkboxSelection: true,
                paginationMode: "server",
                rowCount: rowCount,
                pageSizeOptions: [10, 25, 50, 100],
                paginationModel: { page, pageSize },
                onPaginationModelChange: ({ page, pageSize }) => {
                  setPage(page);
                  setPageSize(pageSize);
                },
                rowSelectionModel: selectedIds,
                onRowSelectionModelChange: handleSelectionChange,
              }}
              enableDynamicHeight={true}
            />

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="outline-secondary" onClick={onBack}>
                <FaStepBackward /> Atras
              </Button>
              <Button variant="outline-success" onClick={handleSaveUsers}>
                <FaSave /> Crear cuenta de cobro
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

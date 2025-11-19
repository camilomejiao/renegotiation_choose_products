import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Nav, Row } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import imgPayments from "../../../../../assets/image/payments/payments.png";
import correctionIcon from "../../../../../assets/image/icons/frame.png";
import StandardTable from "../../../../shared/StandardTable";
import { ModernBanner } from "../../../../shared/ModernBanner";
import { Breadcrumb } from "../../../../shared/Breadcrumb";

//Columns
import { beneficiaryColumns } from "../../../../../helpers/utils/PaymentsColumns";

//services
import { deliveriesCorrectionServices } from "../../../../../helpers/services/DeliveriesCorrectionServices";

//Enum
import { useNavigate } from "react-router-dom";
import {
  DeliveryStatusEnum,
  ResponseStatusEnum,
} from "../../../../../helpers/GlobalEnum";

//Status
const STATUS_ARRAY = Object.values(DeliveryStatusEnum);

export const DeliveriesCorrection = () => {
  const navigate = useNavigate();

  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [rowCount, setRowCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeStatusKey, setActiveStatusKey] = useState(
    DeliveryStatusEnum.REGISTRADO.key
  );

  const searchTimerRef = useRef(null);

  const baseColumns = beneficiaryColumns();
  const columns = [...baseColumns];

  const normalizeRows = useCallback((data = []) => {
    return data.map((row) => ({
      id: row?.id,
      cub_id: row?.beneficiario?.cub_id,
      name: `${row?.beneficiario?.nombre_completo ?? ""}`,
      identification: row?.beneficiario?.identificacion,
      supplier_name: row?.proveedor?.nombre,
      supplier_nit: row?.proveedor?.nit,
      beneficiario_id: row?.beneficiario?.id,
    }));
  }, []);

  const getDeliveriesCorrection = useCallback(
    async (
      pageToFetch = 1,
      sizeToFetch = 100,
      search = "",
      statusDeliveryKey
    ) => {
      setLoading(true);
      try {
        const statusValue = getStatusValueFromKey(statusDeliveryKey);
        const { data, status } =
          await deliveriesCorrectionServices.getDeliveriesCorrection(
            pageToFetch,
            sizeToFetch,
            search,
            statusValue
          );
        if (status === ResponseStatusEnum.OK) {
          const rows = await normalizeRows(data.results);
          setDataTable(rows);
          setRowCount(data.count);
        }
      } catch (error) {
        console.error("Error obteniendo las entregas:", error);
      } finally {
        setLoading(false);
      }
    },
    [normalizeRows]
  );

  const handleRowClick = (params) => {
    navigate(`/admin/deliveries/${params?.row?.beneficiario_id}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  //
  const runSearch = (q = searchQuery) => {
    // limpia un debounce previo
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    const query = (q || "").trim().toLowerCase();
    const canSearch = query.length === 0 || query.length >= 5;
    if (!canSearch) return; // no dispares la búsqueda si 1–4 chars

    // opcional: resetear página si usas paginación
    setPage(0);

    // Si quieres mantener un pequeño debounce para evitar doble click/enter rápidos:
    searchTimerRef.current = setTimeout(() => {
      getDeliveriesCorrection(1, pageSize, query, activeStatusKey);
    }, 150);
  };

  const getStatusValueFromKey = (key) =>
    STATUS_ARRAY.find((s) => s.key === key)?.value ?? null;

  const handleChangeStatus = (newKey) => {
    if (newKey === activeStatusKey) return;
    setActiveStatusKey(newKey);
    setPage(0);
    getDeliveriesCorrection(
      1,
      pageSize,
      (searchQuery || "").trim().toLowerCase(),
      newKey
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Solo hacer la llamada inicial si no hay búsqueda activa
    if (!searchQuery.trim()) {
      getDeliveriesCorrection(page + 1, pageSize, "", activeStatusKey);
    }
  }, [page, pageSize]); // Solo para paginación

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (activeStatusKey) {
      setPage(0);
      getDeliveriesCorrection(
        1,
        pageSize,
        searchQuery.trim().toLowerCase(),
        activeStatusKey
      );
    }
  }, [activeStatusKey]); // Solo cuando cambia el status

  return (
    <>
      <Breadcrumb />
      <div className="container-fluid px-4">
        <ModernBanner
          imageHeader={imgPayments}
          titleHeader="​"
          bannerIcon={correctionIcon}
          bannerInformation="Subsanación de Entregas"
          backgroundInformationColor="#2148C0"
          infoText="Aquí podrás revisar tus entregas que están en estado de subsanación."
        />

        <Row className="gy-2 align-items-center mt-3 mb-3">
          {/* Buscador con botón */}
          <Col xs={12} md={4}>
            <div className="d-flex gap-2">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    runSearch();
                  }
                }}
                className="form-control"
              />
              <Button
                variant="outline-primary"
                className="btn-sm"
                onClick={() => runSearch()}
                disabled={
                  (searchQuery.trim().length > 0 &&
                    searchQuery.trim().length < 5) ||
                  loading
                }
                title={
                  searchQuery.trim().length > 0 && searchQuery.trim().length < 5
                    ? "Escribe al menos 5 caracteres"
                    : "Buscar"
                }
                style={{ minWidth: "45px" }}
              >
                <FaSearch />
              </Button>
            </div>
          </Col>

          {/* Espaciador */}
          <Col xs={12} md={1}></Col>

          {/* Filtros de estado */}
          <Col xs={12} md={7}>
            <Nav
              variant="tabs"
              activeKey={activeStatusKey}
              onSelect={(k) => handleChangeStatus(k)}
            >
              {STATUS_ARRAY.map((st) => (
                <Nav.Item key={st.key}>
                  <Nav.Link eventKey={st.key}>{st.label}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
        </Row>

        <StandardTable
          rows={dataTable}
          columns={columns}
          loading={loading}
          customProps={{
            paginationMode: "server",
            rowCount: rowCount,
            pageSizeOptions: [10, 25, 50, 100],
            paginationModel: { page, pageSize },
            onPaginationModelChange: ({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            },
            onRowClick: handleRowClick,
          }}
          enableDynamicHeight={true}
        />
      </div>
    </>
  );
};

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import StandardTable from "../../../../../shared/StandardTable";

//Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";

//Enum
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";

//Columns
import { beneficiaryColumns } from "../../../../../../helpers/utils/PaymentsColumns";

export const BeneficiaryDeliveryList = ({ onRowSelect }) => {
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [rowCount, setRowCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const searchTimerRef = useRef(null);

  //
  const baseColumns = beneficiaryColumns();
  const columns = [...baseColumns];

  const normalizeRows = useCallback(async (data) => {
    return data.map((row) => ({
      id: row?.id,
      cub_id: row?.beneficiario?.cub_id,
      name: `${row?.beneficiario?.nombre_completo ?? ""}`,
      identification: row?.beneficiario?.identificacion,
      supplier_name: row?.proveedor?.nombre,
      supplier_nit: row?.proveedor?.nit,
    }));
  }, []);

  const getDeliveryList = useCallback(
    async (pageToFetch = 1, sizeToFetch = 100, search = "") => {
      setLoading(true);
      try {
        const { data, status } = await paymentServices.getApprovedDeliveries(
          pageToFetch,
          sizeToFetch,
          search
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
    onRowSelect(params.id);
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
      getDeliveryList(1, pageSize, query);
    }, 150);
  };

  useEffect(() => {
    getDeliveryList(page + 1, pageSize, "");
  }, [getDeliveryList, page, pageSize]);

  return (
    <>
      <Row className="gy-2 align-items-center mt-3 mb-3">
        <Col xs={12} md={6} lg={5}>
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
        </Col>

        <Col>
          <Button
            variant="outline-primary"
            className="button-order-responsive"
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
          >
            Buscar
          </Button>
        </Col>
      </Row>

      <StandardTable
        loading={loading}
        columns={columns}
        rows={dataTable}
        customProps={{
          paginationMode: "server",
          rowCount: rowCount,
          paginationModel: { page, pageSize },
          onPaginationModelChange: ({ page, pageSize }) => {
            setPage(page);
            setPageSize(pageSize);
          },
          onRowClick: handleRowClick,
          pageSizeOptions: [10, 25, 50, 100],
        }}
        enableDynamicHeight={true}
      />
    </>
  );
};

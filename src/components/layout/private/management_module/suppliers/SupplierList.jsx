import { DataGrid } from "@mui/x-data-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

//Utils
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import {
  getAccionColumns,
  getSuppliersColumns,
} from "../../../../../helpers/utils/ManagementColumns";
//Services
import { supplierServices } from "../../../../../helpers/services/SupplierServices";
//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

export const SupplierList = () => {
  const navigate = useNavigate();

  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [rowCount, setRowCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  const searchTimerRef = useRef(null);

  //
  const normalizeRows = useCallback(async (payload) => {
    const rows = payload?.results?.data?.proveedores;
    return rows.map((row) => ({
      id: row?.id,
      name: row?.nombre,
      company_name: row?.nombre_empresa ?? "",
      nit: row?.nit,
      email: row?.correo,
      dept: row?.departamento ?? "",
      muni: row?.municipio ?? "",
      status: row?.aprobado,
      description: row?.estado_aprobacion,
      resolution: row?.resolucion_aprobacion,
    }));
  }, []);

  const getSuppliers = useCallback(
    async (pageToFetch = 1, sizeToFetch = 100, search = "") => {
      try {
        setLoading(true);
        setLoadingTable(true);
        const { data, status } = await supplierServices.getSuppliersByPage(
          sizeToFetch,
          pageToFetch,
          search
        );
        if (status === ResponseStatusEnum.OK) {
          const suppliers = await normalizeRows(data);
          setFilteredSuppliers(suppliers);
          setRowCount(data.count);
        }
      } catch (error) {
        console.error("Error al obtener la lista de proveedores:", error);
      } finally {
        setLoading(false);
        setLoadingTable(false);
      }
    },
    [normalizeRows]
  );

  const handleActiveAndInactive = (SupplierId) => {
    console.log(SupplierId);
  };

  const handleEditClick = (SupplierId) => {
    navigate(`/admin/edit-suppliers/${SupplierId}`);
  };

  const handleDeleteClick = async (SupplierId) => {
    try {
      setLoading(true);
      const { status } = await supplierServices.deleteSupplier(SupplierId);
      if (status === ResponseStatusEnum.OK) {
        AlertComponent.success("Operación realizada correctamente!");
        getSuppliers(page + 1, pageSize, "");
      }

      if (status !== ResponseStatusEnum.OK) {
        AlertComponent.error("No se pudo eliminar el proveedor!");
      }
    } catch (error) {
      console.error("Error al obtener la lista de proveedores:", error);
    } finally {
      setLoading(false);
    }
  };

  //
  const baseColumns = getSuppliersColumns();
  const accions = getAccionColumns(
    handleActiveAndInactive,
    handleEditClick,
    handleDeleteClick
  );
  const columns = [...baseColumns, ...accions];

  //
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // debounce
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (query.length >= 5 || query.length === 0) {
      searchTimerRef.current = setTimeout(() => {
        getSuppliers(page + 1, pageSize, query);
      }, 300);
    }
  };

  useEffect(() => {
    getSuppliers(page + 1, pageSize, "");
  }, [getSuppliers, page, pageSize]);

  return (
    <>
      <div className="container mt-lg-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 w-100 mb-3 mt-5">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="input-responsive me-2"
          />
          <div className="text-end">
            <Button
              variant="outline-success"
              size="md"
              onClick={() => navigate("/admin/create-suppliers")}
              className="button-order-responsive"
            >
              <FaPlus /> Crear Proveedor
            </Button>
          </div>
        </div>

        {loading && (
          <div className="overlay">
            <div className="loader">Cargando Datos...</div>
          </div>
        )}

        <div className="data-grid-card" style={{ height: 600 }}>
          <DataGrid
            className="data-grid"
            rows={filteredSuppliers}
            columns={columns}
            loading={loadingTable}
            paginationMode="server"
            rowCount={rowCount}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            }}
          />
        </div>
      </div>
    </>
  );
};

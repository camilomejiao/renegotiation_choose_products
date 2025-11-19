import { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaFileExcel, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StandardTable from "../../../../shared/StandardTable";

import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
import { Breadcrumb } from "../../../../shared/Breadcrumb";

//
import {
  getConvocationColumns,
  getEditActionsColumns,
} from "../../../../../helpers/utils/ConvocationProductColumns";

//Services
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";
import { convocationProductsServices } from "../../../../../helpers/services/ConvocationProductsServices";

export const ListProductsByConvocation = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showSuppliersModal, setShowSuppliersModal] = useState(false);
  const [suppliersForModal, setSuppliersForModal] = useState([]);

  const normalizeRows = useCallback(async (payload) => {
    const rows = payload?.data ?? [];

    return rows.map((row) => {
      const plans = (row?.planes ?? []).map((p) => ({
        id: p?.id ?? null,
        name: (p?.plan?.nombre ?? "").trim(),
      }));

      return {
        id: row?.id,
        date: row?.fcrea.split("T")[0],
        name: (row?.nombre ?? "").replace(/\r?\n/g, " ").trim(),
        status: row?.abierto ? "Abierto" : "Cerrado",
        n_suppliers: row?.cant_proveedores ?? row?.proveedores?.length ?? 0,
        report: row?.id,
        suppliersList: row?.proveedores ?? [],
        plans,
      };
    });
  }, []);

  const getProductsByConvocation = useCallback(async () => {
    try {
      const { data, status } =
        await convocationProductsServices.getConvocationInformation();
      if (status === ResponseStatusEnum.OK) {
        const products = await normalizeRows(data);
        setRows(products);
        setFilteredRows(products);
      }
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  }, [normalizeRows]);

  //
  const handleModalSuppliers = (row) => {
    setSuppliersForModal(row?.suppliersList || []);
    setShowSuppliersModal(true);
  };

  //
  const handleReport = () => {
    navigate("/admin/report-by-convocation");
  };

  // Función para eliminar un elemento de la tabla
  const handleEditClick = (id) => {
    navigate(`/admin/edit-products-by-convocation/${id}`);
  };

  const baseColumns = getConvocationColumns(handleModalSuppliers, handleReport);
  const accion = getEditActionsColumns(handleEditClick);
  const columns = [...baseColumns, ...accion];

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredData = rows.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(query)
      )
    );
    setFilteredRows(filteredData);
  };

  const closeSuppliersModal = () => {
    setShowSuppliersModal(false);
    setSuppliersForModal([]);
  };

  const handleCreateProducts = () => navigate("/admin/product-upload");

  // Cargar datos iniciales
  useEffect(() => {
    getProductsByConvocation();
  }, [getProductsByConvocation]);

  return (
    <>
      <Breadcrumb />
      <div className="main-container">
      <HeaderImage
        imageHeader={imgPeople}
        titleHeader={"¡Empieza a agregar tus productos!"}
        bannerIcon={""}
        backgroundIconColor={""}
        bannerInformation={""}
        backgroundInformationColor={""}
      />

      <div className="container mt-lg-3">
        <div className="text-end">
          <Button
            variant="outline-primary"
            size="md"
            onClick={handleCreateProducts}
            className="button-order-responsive"
          >
            <FaPlus /> Crear
          </Button>

          <Button
            variant="outline-success"
            onClick={handleReport}
            title="Generar reporte (Excel)"
          >
            <FaFileExcel /> Reporte
          </Button>
        </div>

        <hr />

        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mt-3 mb-3">
          <div className="d-flex flex-column flex-md-row w-100 w-md-auto">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="input-responsive me-2"
            />
          </div>
        </div>

        <StandardTable
          rows={filteredRows}
          columns={columns}
          loading={loading}
          customProps={{
            editMode: "row",
            pageSizeOptions: [10, 25, 50, 100],
            paginationModel: { page: 0, pageSize: 25 },
            getRowClassName: (params) =>
              params.row.status === "Abierto" ? "row-open" : "row-closed",
          }}
          enableDynamicHeight={true}
        />
      </div>

      <Modal show={showSuppliersModal} onHide={closeSuppliersModal} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#40A581", color: "#fff" }}
        >
          <Modal.Title>Proveedores</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {suppliersForModal.length === 0 ? (
            <div className="text-center text-muted">
              No hay proveedores registrados.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Proveedor</th>
                    <th>NIT</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliersForModal.map((s, idx) => (
                    <tr key={s.id ?? idx}>
                      <td>{idx + 1}</td>
                      <td>{s.nombre}</td>
                      <td>{s.nit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-danger" onClick={closeSuppliersModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
};

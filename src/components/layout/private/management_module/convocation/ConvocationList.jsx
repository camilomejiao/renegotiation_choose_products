import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StandardTable from "../../../../shared/StandardTable";

//Img
import imgDCSIPeople from "../../../../../assets/image/addProducts/imgDSCIPeople.png";
import convocationIcon from "../../../../../assets/image/icons/frame.png";

//Components
import { ModernBanner } from "../../../../shared/ModernBanner";
import { Breadcrumb } from "../../../../shared/Breadcrumb";

//Utils
import {
  getAccionColumns,
  getConvocationColumn,
} from "../../../../../helpers/utils/ManagementColumns";

//Services
import { convocationServices } from "../../../../../helpers/services/ConvocationServices";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

//Helper
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

export const ConvocationList = () => {
  const navigate = useNavigate();

  const [convocations, setConvocations] = useState([]);
  const [filteredConvocations, setFilteredConvocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  const normalizeRows = useCallback(async (data) => {
    const payload = data.data.jornadas;

    return payload.map((row) => ({
      id: row?.id,
      name: row?.nombre,
      start_date: row?.fecha_inicio,
      end_date: row?.fecha_fin,
      remaining_days: row?.dias_restantes,
      status: row?.abierto ? "ACTIVO" : "INACTIVO",
      description: row?.estado_descripcion,
    }));
  }, []);

  const getConvocationList = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingTable(true);
      const { data, status } = await convocationServices.get();
      if (status === ResponseStatusEnum.OK) {
        const convocationResponse = await normalizeRows(data);
        setConvocations(convocationResponse);
        setFilteredConvocations(convocationResponse);
      }

      if (status !== ResponseStatusEnum.OK) {
        AlertComponent.warning("Error", "Al cargar los datos");
      }
    } catch (error) {
      console.error("Error al obtener la lista de jornadas:", error);
    } finally {
      setLoading(false);
      setLoadingTable(false);
    }
  }, [normalizeRows]);

  const handleEditClick = (rowId) => {
    navigate(`/admin/create-convocation/${rowId}`);
  };

  const handleDeleteClick = async (rowId) => {
    try {
      setLoading(true);
      const { status } = await convocationServices.delete(rowId);
      if (status === ResponseStatusEnum.OK) {
        AlertComponent.success("", "Jornada eliminada exitosamente!");
        //reloadPage();
      }

      if (status === ResponseStatusEnum.INTERNAL_SERVER_ERROR) {
        AlertComponent.error("Error", "No se ha podido eliminar la jornada");
        //reloadPage();
      }
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
      AlertComponent.error("", "Error al eliminar la jornada");
      reloadPage();
    } finally {
      setLoading(false);
    }
  };

  const handleActiveAndInactive = (rowId) => {
    console.log(rowId);
  };

  //
  const baseColumns = getConvocationColumn();
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
    const filteredData = convocations.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(query)
      )
    );
    setFilteredConvocations(filteredData);
  };

  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    getConvocationList();
  }, [getConvocationList]);

  return (
    <>
      <Breadcrumb />
      <div className="container-fluid px-4">
        <ModernBanner
          imageHeader={imgDCSIPeople}
          titleHeader="​"
          bannerIcon={convocationIcon}
          bannerInformation="Gestión de Jornadas"
          backgroundInformationColor="#2148C0"
          infoText="Administra las jornadas de convocatoria, crea nuevas jornadas y gestiona su estado y configuración."
        />

        <div className="mb-4">
          <h3 className="text-primary fw-bold mb-3">
            <FaCalendarAlt className="me-2" />
            Lista de Jornadas
          </h3>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex gap-2">
            <input
              type="text"
              placeholder="Buscar jornadas..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-control"
              style={{ width: '300px' }}
            />
          </div>
          
          <div className="d-flex gap-2">
            <Button
              variant="outline-success"
              onClick={() => navigate("/admin/create-convocation")}
            >
              <FaPlus className="me-2" />
              Crear Jornada
            </Button>
          </div>
        </div>

        {loading && (
          <div className="overlay">
            <div className="loader">Cargando Datos...</div>
          </div>
        )}

        <StandardTable
          rows={filteredConvocations}
          columns={columns}
          loading={loadingTable}
          customProps={{
            editMode: "row",
            pagination: true,
            initialState: {
              pagination: {
                paginationModel: { page: 0, pageSize: 25 },
              },
            },
            pageSizeOptions: [10, 25, 50, 100],
          }}
          enableDynamicHeight={true}
        />
      </div>
    </>
  );
};

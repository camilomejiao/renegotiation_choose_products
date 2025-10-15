import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

//
import StandardTable from "../../../shared/standardTable/StandardTable";

//Img
import imgDCSIPeople from "../../../../../assets/image/addProducts/imgDSCIPeople.png";

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
import imgAdd from "../../../../../assets/image/payments/imgPay.png";
import {HeaderImage} from "../../../shared/header_image/HeaderImage";

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
      <HeaderImage
          imageHeader={imgDCSIPeople}
          titleHeader={"¡Gestión de Jornadas!"}
          bannerIcon={imgAdd}
          backgroundIconColor={"#2148C0"}
          bannerInformation={
            "Aquí podrás realizar la entrega de todos tus productos."
          }
          backgroundInformationColor={"#F66D1F"}
      />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 w-100">
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
            onClick={() => navigate("/admin/create-convocation")}
            className="button-order-responsive"
          >
            <FaPlus /> Crear Jornada
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
    </>
  );
};

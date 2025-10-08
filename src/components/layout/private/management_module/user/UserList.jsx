import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StandardTable from "../../../../shared/StandardTable";

//Utils
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { userServices } from "../../../../../helpers/services/UserServices";
import {
  getAccionColumns,
  getSystemUsersColumns,
} from "../../../../../helpers/utils/ManagementColumns";

export const UserList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [rowCount, setRowCount] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  //
  const normalizeRows = useCallback(async (payload) => {
    const rows = payload?.data?.usuarios;
    return rows.map((row) => ({
      id: row?.id,
      name: row?.nombre,
      last_name: row?.apellido,
      identification_number: row?.numero_identificacion,
      email: row?.email,
      rol: row?.rol_nombre,
      status: row?.activo,
      update_status: row?.activo,
    }));
  }, []);

  const getUsersList = useCallback(
    async (pageToFetch = 1, sizeToFetch = 100) => {
      try {
        setLoading(true);
        setLoadingTable(true);
        const { data, status } = await userServices.getUsers(
          pageToFetch,
          sizeToFetch
        );
        if (status === ResponseStatusEnum.OK) {
          const users = await normalizeRows(data);
          setUsers(users);
          setFilteredUsers(users);
          setRowCount(data?.data?.paginacion?.total);
        }
      } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
      } finally {
        setLoading(false);
        setLoadingTable(false);
      }
    },
    [normalizeRows]
  );

  const handleActiveAndInactive = async (user) => {
    try {
      setLoading(true);
      const payload = {
        activo: !user.status,
      };
      const { status } = await userServices.updateStatus(user.id, payload);
      if (status === ResponseStatusEnum.OK) {
        AlertComponent.success("Usuario actualizado correctamente");
        getUsersList(page + 1, pageSize);
      }
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (userId) => {
    navigate(`/admin/edit-users/${userId}`);
  };

  //
  const baseColumns = getSystemUsersColumns();
  const accions = getAccionColumns(
    handleActiveAndInactive,
    handleEditClick,
    ""
  );
  const columns = [...baseColumns, ...accions];

  //
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredData = users.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(query)
      )
    );
    setFilteredUsers(filteredData);
  };

  useEffect(() => {
    getUsersList(page + 1, pageSize);
  }, [getUsersList, page, pageSize]);

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
              onClick={() => navigate("/admin/create-users")}
              className="button-order-responsive"
            >
              <FaPlus /> Crear Usuario
            </Button>
          </div>
        </div>

        {loading && (
          <div className="overlay">
            <div className="loader">Cargando Datos...</div>
          </div>
        )}

        <StandardTable
          rows={filteredUsers}
          columns={columns}
          loading={loadingTable}
          noRowsText="No hay usuarios disponibles"
          customProps={{
            paginationMode: "server",
            rowCount: rowCount,
            pageSizeOptions: [10, 25, 50, 100],
            paginationModel: { page, pageSize },
            onPaginationModelChange: ({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          enableDynamicHeight={true}
        />
      </div>
    </>
  );
};

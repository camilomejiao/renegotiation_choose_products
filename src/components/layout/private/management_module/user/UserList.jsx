import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Loading } from "../../../shared/loading/Loading";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaPlus} from "react-icons/fa";

//Utils
import { getAccionColumns, getSystemUsersColumns } from "../../../../../helpers/utils/ManagementColumns";
import {userServices} from "../../../../../helpers/services/UserServices";
import {ResponseStatusEnum} from "../../../../../helpers/GlobalEnum";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";


export const UserList = () => {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);

    //
    const getUsersList = async (pageToFetch = 1, sizeToFetch = 100) => {
        try {
            setLoading(true);
            setLoadingTable(true);
            const {data, status} = await userServices.getUsers(pageToFetch, sizeToFetch);
            if(status=== ResponseStatusEnum.OK) {
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
    };

    //
    const normalizeRows = async (payload) => {
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
    };

    const handleActiveAndInactive = async (user) => {
        try {
            setLoading(true);
            const payload = {
                activo: !user.status
            }
            const { status} = await userServices.updateStatus(user.id, payload);
            if(status === ResponseStatusEnum.OK) {
                AlertComponent.success("Usuario actualizado correctamente");
                getUsersList(page + 1, pageSize);
            }
        } catch (error) {
            console.error("Error al obtener la lista de usuarios:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleEditClick = (userId) => {
        navigate(`/admin/edit-users/${userId}`);
    }

    //
    const baseColumns = getSystemUsersColumns();
    const accions = getAccionColumns(handleActiveAndInactive, handleEditClick, "");
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
    }, [page, pageSize])

    return (
        <>
            <div className="container mt-lg-3">

                <div className="table-toolbar mt-5">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="input-responsive"
                    />
                    <div className="text-end">
                        <Button
                            variant="outline-success"
                            size="md"
                            onClick={() => navigate('/admin/create-users')}
                            className="button-order-responsive"
                        >
                            <FaPlus/> Crear Usuario
                        </Button>
                    </div>
                </div>

                {loading && <Loading fullScreen text="Cargando Datos..." />}

                <div style={{height: 600, width: "100%"}}>
                    <DataGrid
                        rows={filteredUsers}
                        columns={columns}
                        loading={loadingTable}
                        paginationMode="server"
                        rowCount={rowCount}
                        pageSizeOptions={[25, 50, 100]}
                        paginationModel={{ page, pageSize }}
                        onPaginationModelChange={({ page, pageSize }) => {
                            setPage(page);
                            setPageSize(pageSize);
                        }}
                        componentsProps={{
                            columnHeader: {
                                style: {
                                    textAlign: "left",
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    wordWrap: "break-word",
                                },
                            },
                        }}
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#2d3a4d",
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
                                backgroundColor: "#2d3a4d !important",
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
            </div>
        </>
    )
}

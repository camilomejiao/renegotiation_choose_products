import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaPlus} from "react-icons/fa";

//Utils
import { getAccionColumns, getSystemUsersColumns } from "../../../../../helpers/utils/ManagementColumns";

//Mock
const mockDataUsers = [
    { id: 1, nombre: 'Camilo 1', apellido: 'Mejia 1', email: 'cmejia1@gmail.com', rol: 'ADMIN', status: 'ACTIVO' },
    { id: 2, nombre: 'Camilo 2', apellido: 'Mejia 2', email: 'cmejia2@gmail.com', rol: 'ADMIN', status: 'ACTIVO' },
    { id: 3, nombre: 'Camilo 3', apellido: 'Mejia 3', email: 'cmejia3@gmail.com', rol: 'ADMIN', status: 'ACTIVO' }
]

export const UserList = () => {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);


    //
    const getUsersList = async () => {
        try {
            setLoading(true);
            setLoadingTable(true);
            const users = await normalizeRows(mockDataUsers);
            console.log('users: ', users);
            setUsers(users);
            setFilteredUsers(users);
        } catch (error) {
            console.error("Error al obtener la lista de usuarios:", error);
        } finally {
            setLoading(false);
            setLoadingTable(false);
        }
    };

    //
    const normalizeRows = async (payload) => {
        return payload.map((row) => ({
            id: row?.id,
            name: row?.nombre,
            last_name: row?.apellido,
            email: row?.email,
            rol: row?.rol,
            status: row?.status,
        }));
    };

    const handleActiveAndInactive = (userId) => {
        console.log(userId);
    }

    const handleEditClick = (userId) => {
        console.log(userId);
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
        getUsersList();
    }, [])

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
                            onClick={() => navigate('/admin/create-users')}
                            className="button-order-responsive"
                        >
                            <FaPlus/> Crear Usuario
                        </Button>
                    </div>
                </div>

                {loading && (
                    <div className="overlay">
                        <div className="loader">Cargando Datos...</div>
                    </div>
                )}

                <div style={{height: 600, width: "100%"}}>
                    <DataGrid
                        rows={filteredUsers}
                        columns={columns}
                        editMode="row"
                        pagination
                        loading={loadingTable}
                        pageSize={100}
                        rowsPerPageOptions={[100, 500, 1000]}
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
            </div>
        </>
    )
}
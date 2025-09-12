import { Button } from "react-bootstrap";
import {FaCheck, FaRegEdit} from "react-icons/fa";


export const getSystemUsersColumns = (handleActiveAndInactiveUser, handleEditClick) => ([
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "NOMBRE", width: 200 },
    { field: "last_name", headerName: "APELLIDO", width: 200 },
    { field: "email", headerName: "EMAIL", width: 200 },
    { field: "rol", headerName: "ROL", width: 200 },
    {
        field: 'status',
        headerName: 'ACTIVO',
        width: 150,
        renderCell: (params) => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Button
                    variant="outline-info"
                    onClick={() => handleActiveAndInactiveUser(params.row.id)}
                    title="Activar e Inactivar"
                >
                    <FaCheck />
                </Button>
            </div>
        ),
        sortable: false,
        filterable: false,
    },
    {
        field: 'actions',
        headerName: 'Acciones',
        width: 150,
        renderCell: (params) => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Button
                    variant="outline-warning"
                    onClick={() => handleEditClick(params.row.id)}
                    title="Editar usuario"
                >
                    <FaRegEdit />
                </Button>
            </div>
        ),
        sortable: false,
        filterable: false,
    },
]);


export const getSuppliersColumns = () => ([
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "NOMBRE REPRESNETATE LEGAL", width: 200 },
    { field: "company_name", headerName: "RAZÓN SOCIAL", width: 200 },
    { field: "nit", headerName: "NIT", width: 200 },
    { field: "email", headerName: "EMAIL", width: 200 },
    { field: "dept", headerName: "DEPARTAMENTO", width: 200 },
    { field: "muni", headerName: "MUNICIPIO", width: 200 },
    { field: "status", headerName: "ESTADO", width: 200 },
    { field: "resolution", headerName: "RESOLUCIÓN", width: 200 },
]);

export const getBeneficiaryColumn = () => ([
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "NOMBRE", width: 200 },
    { field: "last_name", headerName: "APELLIDO", width: 200 },
    { field: "cub", headerName: "CUB", width: 200 },
    { field: "identification_number", headerName: "CEDULA", width: 200 },
    { field: "email", headerName: "EMAIL", width: 200 },
    { field: "cellphone", headerName: "TELEFONO", width: 200 },
    { field: "dept", headerName: "DEPARTAMENTO", width: 200 },
    { field: "muni", headerName: "MUNICIPIO", width: 200 },
    { field: "status", headerName: "ESTADO", width: 200 },
    { field: "resolution", headerName: "RESOLUCIÓN", width: 200 },
]);

export const getConvocationColumn = () => ([
    { field: "id", headerName: "ID", width: 70 },
]);
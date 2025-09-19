import { Button } from "react-bootstrap";
import { FaCheck, FaRegEdit, FaTimes, FaTrash } from "react-icons/fa";


export const getSystemUsersColumns = (handleActiveAndInactive) => ([
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "NOMBRE", width: 200 },
    { field: "last_name", headerName: "APELLIDO", width: 200 },
    { field: "identification_number", headerName: "CC Ó NIT", width: 200 },
    { field: "email", headerName: "EMAIL", width: 200 },
    { field: "rol", headerName: "ROL", width: 200 },
]);


export const getSuppliersColumns = () => ([
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "NOMBRE REPRESNETATE LEGAL", width: 300 },
    { field: "company_name", headerName: "RAZÓN SOCIAL", width: 300 },
    { field: "nit", headerName: "NIT", width: 200 },
    { field: "email", headerName: "EMAIL", width: 200 },
    { field: "dept", headerName: "DEPARTAMENTO", width: 200 },
    { field: "muni", headerName: "MUNICIPIO", width: 200 },
    { field: "description", headerName: "DESCRIPCIÓN DEL ESTADO", width: 150 },
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
    { field: "name", headerName: "NOMBRE", width: 200 },
    { field: "start_date", headerName: "FECHA INICIAL", width: 200 },
    { field: "end_date", headerName: "FECHA FINAL", width: 200 },
    { field: "remaining_days", headerName: "DIAS RESTANTES", width: 200 },
    { field: "status", headerName: "ESTADO", width: 200 },
    { field: "description", headerName: "DESCRIPCIÓN", width: 200 },
]);

export const getAccionColumns = (handleActiveAndInactive, handleEditClick, handleDeleteClick) => [
    {
        field: 'status',
        headerName: 'ESTADO',
        width: 150,
        renderCell: (params) => {
            const isActive = Boolean(params.value);
            return (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                    <Button
                        variant={isActive ? "outline-success" : "outline-danger"}
                        onClick={() => handleActiveAndInactive(params.row)}
                        title={isActive ? "Inactivar" : "Activar"}
                    >
                        {isActive ? <FaCheck /> : <FaTimes />}
                    </Button>
                </div>
            );
        },
        sortable: false,
        filterable: false,
    },
    {
        field: 'actions',
        headerName: 'Acciones',
        width: 150,
        renderCell: (params) => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <Button
                    variant="outline-warning"
                    onClick={() => handleEditClick(params.row.id)}
                    title="Editar usuario"
                >
                    <FaRegEdit />
                </Button>

                <Button
                    variant="outline-danger"
                    onClick={() => handleDeleteClick(params.row.id)}
                    title="Editar usuario"
                >
                    <FaTrash />
                </Button>
            </div>
        ),
        sortable: false,
        filterable: false,
    },
];
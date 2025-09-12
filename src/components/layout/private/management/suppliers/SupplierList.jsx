import { useNavigate} from "react-router-dom";
import { useEffect, useState} from "react";
import { Button} from "react-bootstrap";
import { FaPlus} from "react-icons/fa";
import { DataGrid} from "@mui/x-data-grid";

//Utils
import { getSuppliersColumns} from "../../../../../helpers/utils/ManagementColumns";

//Mocks
const mockDataSupplier = [
    { id: 1, nombre: 'Camilo 1', nombre_empresa: 'Mejia 1', nit: 2345, email: 'cmejia1@gmail.com', celular: '3218776613', status: 'ACTIVO', resolucion: 'resolucion', departamento: 'PUTUMAYO', municipio: 'PUERTO ASIS' },
    { id: 2, nombre: 'Camilo 2', nombre_empresa: 'Mejia 2', nit: 2345, email: 'cmejia2@gmail.com', celular: '3218776613', status: 'ACTIVO', resolucion: 'resolucion', departamento: 'PUTUMAYO', municipio: 'PUERTO ASIS' },
    { id: 3, nombre: 'Camilo 3', nombre_empresa: 'Mejia 3', nit: 2345, email: 'cmejia3@gmail.com', celular: '3218776613', status: 'ACTIVO', resolucion: 'resolucion', departamento: 'PUTUMAYO', municipio: 'PUERTO ASIS' }
]

export const SupplierList = () => {

    const navigate = useNavigate();

    const [suppliersRow, setSuppliersRow] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);

    //
    const getSuppliers = async () => {
        try {
            setLoading(true);
            setLoadingTable(true);
            const suppliers = await normalizeRows(mockDataSupplier);
            console.log('suppliers: ', suppliers);
            setSuppliersRow(suppliers);
            setFilteredSuppliers(suppliers);
        } catch (error) {
            console.error("Error al obtener la lista de proveedores:", error);
        } finally {
            setLoading(false);
            setLoadingTable(false);
        }
    }

    const normalizeRows = async (payload) => {
        return payload.map((row) => ({
            id: row?.id,
            name: row?.nombre,
            company_name: row?.nombre_empresa,
            nit: row?.nit,
            email: row?.email,
            dept: row?.departamento,
            muni: row?.municipio,
            status: row?.status,
            resolution: row?.resolucion,
        }));
    };

    //
    const baseColumns = getSuppliersColumns();
    const columns = [...baseColumns];

    //
    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filteredData = suppliersRow.filter((row) =>
            Object.values(row).some((value) =>
                value.toString().toLowerCase().includes(query)
            )
        );
        setFilteredSuppliers(filteredData);
    };

    useEffect(() => {
        getSuppliers();
    }, []);


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
                            onClick={() => navigate('/admin/create-suppliers')}
                            className="button-order-responsive"
                        >
                            <FaPlus/> Crear Proveedor
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
                        rows={filteredSuppliers}
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
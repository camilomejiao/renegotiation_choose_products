import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { Loading } from "../../../shared/loading/Loading";

//Utils
import {getAccionColumns, getSuppliersColumns} from "../../../../../helpers/utils/ManagementColumns";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
//Services
import { supplierServices } from "../../../../../helpers/services/SupplierServices";
//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

export const SupplierList = () => {

    const navigate = useNavigate();

    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);

    const searchTimerRef = useRef(null);

    //
    const getSuppliers = async (pageToFetch = 1, sizeToFetch = 100, search = "") => {
        try {
            setLoading(true);
            setLoadingTable(true);
            const {data, status} =  await supplierServices.getSuppliersByPage(sizeToFetch, pageToFetch, search);
            if(status === ResponseStatusEnum.OK) {
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
    }

    const normalizeRows = async (payload) => {
        const rows = payload?.results?.data?.proveedores;
        return rows.map((row) => ({
            id: row?.id,
            name: row?.nombre_representante ?? "", // Nombre del representante legal
            company_name: row?.nombre ?? "", // Razón social (nombre de la empresa)
            nit: row?.nit,
            email: row?.correo,
            dept: row?.depto_name ?? "",
            muni: row?.municipio_name ?? "",
            status: row?.aprobado,
            description: row?.estado_aprobacion,
            resolution: row?.resolucion_aprobacion,
        }));
    };

    const handleActiveAndInactive = (SupplierId) => {
        console.log(SupplierId);
    }

    const handleEditClick = (SupplierId) => {
        navigate(`/admin/edit-suppliers/${SupplierId}`);
    }

    const handleDeleteClick = async (SupplierId) => {
        try {
            setLoading(true);
            const { status} = await supplierServices.deleteSupplier(SupplierId);
            if(status === ResponseStatusEnum.OK) {
                AlertComponent.success("Operación realizada correctamente!");
                getSuppliers(page + 1, pageSize, "");
            }

            if(status !== ResponseStatusEnum.OK) {
                AlertComponent.error("No se pudo eliminar el proveedor!");
            }
        } catch (error) {
            console.error("Error al obtener la lista de proveedores:", error);
        } finally {
            setLoading(false);
        }
    }

    //
    const baseColumns = getSuppliersColumns();
    const accions = getAccionColumns(handleActiveAndInactive, handleEditClick, handleDeleteClick);
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
    }, [page, pageSize]);


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
                            onClick={() => navigate('/admin/create-suppliers')}
                            className="button-order-responsive"
                        >
                            <FaPlus/> Crear Proveedor
                        </Button>
                    </div>
                </div>

                {loading && <Loading fullScreen text="Cargando Datos..." />}

                <div style={{ height: 600, width: "auto" }}>
                    <DataGrid
                        rows={filteredSuppliers}
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

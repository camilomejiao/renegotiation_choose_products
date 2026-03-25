import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AlertComponent from "../../../../../helpers/alert/AlertComponent";
//Services
import { supplierServices } from "../../../../../helpers/services/SupplierServices";
//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";
import { ManagementTableSection } from "../ui/ManagementTableSection";
import { createSuppliersManagementColumns } from "../ui/managementTableColumns";

export const SupplierList = () => {

    const navigate = useNavigate();

    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingTable, setLoadingTable] = useState(false);

    const isSearchingRef = useRef(false);

    //
    const getSuppliers = async (pageToFetch = 1, sizeToFetch = 100, search = "") => {
        try {
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

    const handleActiveAndInactive = (supplier) => {
        console.log(supplier);
    }

    const handleEditClick = (SupplierId) => {
        navigate(`/admin/edit-suppliers/${SupplierId}`);
    }

    const handleDeleteClick = async (SupplierId) => {
        try {
            setLoadingTable(true);
            const { status} = await supplierServices.deleteSupplier(SupplierId);
            if(status === ResponseStatusEnum.OK) {
                AlertComponent.success("Operación realizada correctamente!");
                getSuppliers(page, pageSize, "");
            }

            if(status !== ResponseStatusEnum.OK) {
                AlertComponent.error("No se pudo eliminar el proveedor!");
            }
        } catch (error) {
            console.error("Error al obtener la lista de proveedores:", error);
        } finally {
            setLoadingTable(false);
        }
    }

    const columns = createSuppliersManagementColumns({
        onToggleStatus: handleActiveAndInactive,
        onEdit: handleEditClick,
        onDelete: handleDeleteClick,
    });

    //
    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        setPage(1);
        isSearchingRef.current = true;
    };

    useEffect(() => {
        if (isSearchingRef.current) {
            const timer = setTimeout(() => {
                if (searchQuery.trim()) {
                    getSuppliers(page, pageSize, searchQuery);
                } else {
                    getSuppliers(1, pageSize, "");
                }
                isSearchingRef.current = false;
            }, 500);
            return () => clearTimeout(timer);
        }
        getSuppliers(page, pageSize, searchQuery);
    }, [page, pageSize, searchQuery]);

    const handlePageChange = (nextPage, nextPageSize) => {
        setPage(nextPage);
        setPageSize(nextPageSize);
    };


    return (
        <>
            <ManagementTableSection
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                createLabel="Crear Proveedor"
                onCreate={() => navigate('/admin/create-suppliers')}
                columns={columns}
                dataSource={filteredSuppliers}
                loading={loadingTable}
                total={rowCount}
                currentPage={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />
        </>
    )
}

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {userServices} from "../../../../../helpers/services/UserServices";
import {ResponseStatusEnum} from "../../../../../helpers/GlobalEnum";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { ManagementTableSection } from "../ui/ManagementTableSection";
import { createUsersManagementColumns } from "../ui/managementTableColumns";


export const UserList = () => {

    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingTable, setLoadingTable] = useState(false);
    const isSearchingRef = useRef(false);

    //
    const getUsersList = async (pageToFetch = 1, sizeToFetch = 100, search = "") => {
        try {
            setLoadingTable(true);
            const {data, status} = await userServices.getUsers(pageToFetch, sizeToFetch, search);
            if(status=== ResponseStatusEnum.OK) {
                const users = await normalizeRows(data);
                setFilteredUsers(users);
                setRowCount(data?.data?.paginacion?.total);
            }
        } catch (error) {
            console.error("Error al obtener la lista de usuarios:", error);
        } finally {
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
            setLoadingTable(true);
            const payload = {
                activo: !user.status
            }
            const { status} = await userServices.updateStatus(user.id, payload);
            if(status === ResponseStatusEnum.OK) {
                AlertComponent.success("Usuario actualizado correctamente");
                getUsersList(page, pageSize);
            }
        } catch (error) {
            console.error("Error al obtener la lista de usuarios:", error);
        } finally {
            setLoadingTable(false);
        }
    }

    const handleEditClick = (userId) => {
        navigate(`/admin/edit-users/${userId}`);
    }

    const handleDeleteClick = async (userId) => {
        try {
            setLoadingTable(true);
            const { status } = await userServices.deleteUser(userId);

            if (status === ResponseStatusEnum.OK || status === ResponseStatusEnum.NO_CONTENT) {
                AlertComponent.success("Usuario eliminado correctamente");
                getUsersList(page, pageSize, searchQuery);
                return;
            }

            AlertComponent.error("No se pudo eliminar el usuario");
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            AlertComponent.error("No se pudo eliminar el usuario");
        } finally {
            setLoadingTable(false);
        }
    }

    const columns = createUsersManagementColumns({
        onToggleStatus: handleActiveAndInactive,
        onEdit: handleEditClick,
        onDelete: handleDeleteClick,
    });

    //
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setPage(1);
        isSearchingRef.current = true;
    };

    useEffect(() => {
        if (isSearchingRef.current) {
            const timer = setTimeout(() => {
                if (searchQuery.trim()) {
                    getUsersList(page, pageSize, searchQuery);
                } else {
                    getUsersList(1, pageSize, "");
                }
                isSearchingRef.current = false;
            }, 500);
            return () => clearTimeout(timer);
        }
        getUsersList(page, pageSize, searchQuery);
    }, [page, pageSize, searchQuery])

    const handlePageChange = (nextPage, nextPageSize) => {
        setPage(nextPage);
        setPageSize(nextPageSize);
    };

    return (
        <>
            <ManagementTableSection
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                createLabel="Crear Usuario"
                onCreate={() => navigate('/admin/create-users')}
                columns={columns}
                dataSource={filteredUsers}
                loading={loadingTable}
                total={rowCount}
                currentPage={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />
        </>
    )
}

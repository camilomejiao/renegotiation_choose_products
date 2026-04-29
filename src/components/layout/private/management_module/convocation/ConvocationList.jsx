import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loading } from "../../../shared/loading/Loading";

//Utils
import { createConvocationManagementColumns } from "../ui/managementTableColumns";

//Services
import { convocationServices } from "../../../../../helpers/services/ConvocationServices";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

//Helper
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import imgPayments from "../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../assets/image/payments/imgPay.png";
import {HeaderImage} from "../../../shared/header_image/HeaderImage";
import { ManagementTableSection } from "../ui/ManagementTableSection";


export const ConvocationList = () => {

    const navigate = useNavigate();

    const [convocations, setConvocations] = useState([]);
    const [filteredConvocations, setFilteredConvocations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);

    const getConvocationList = async () => {
        try {
            setLoading(true);
            setLoadingTable(true);
            const {data, status} = await convocationServices.get();
            if(status === ResponseStatusEnum.OK) {
                const convocationResponse = await normalizeRows(data);
                setConvocations(convocationResponse);
                setFilteredConvocations(convocationResponse);
            }

            if(status !== ResponseStatusEnum.OK) {
                AlertComponent.warning("Error", 'Al cargar los datos');
            }
        } catch (error) {
            console.error("Error al obtener la lista de jornadas:", error);
        } finally {
            setLoading(false);
            setLoadingTable(false);
        }
    }

    //
    const normalizeRows = async (data) => {
        const payload =  data.data.jornadas;

        return payload.map((row) => ({
            id: row?.id,
            name: row?.nombre,
            start_date: row?.fecha_inicio,
            end_date: row?.fecha_fin,
            remaining_days: row?.dias_restantes,
            status: Boolean(row?.abierto),
            statusLabel: row?.abierto ? 'ACTIVO' : 'INACTIVO',
            description: row?.estado_descripcion,
        }));
    };

    const handleEditClick = (rowId) => {
        navigate(`/admin/create-convocation/${rowId}`);
    }

    const handleDeleteClick = async (rowId) => {
        try {
            setLoading(true)
            const { status} = await convocationServices.delete(rowId);
            if (status === ResponseStatusEnum.OK) {
                AlertComponent.success('', 'Jornada eliminada exitosamente!');
                //reloadPage();
            }

            if (status === ResponseStatusEnum.INTERNAL_SERVER_ERROR) {
                AlertComponent.error('Error', 'No se ha podido eliminar la jornada');
                //reloadPage();
            }
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
            AlertComponent.error('', 'Error al eliminar la jornada');
            reloadPage();
        } finally {
            setLoading(false);
        }
    }

    const handleActiveAndInactive = (rowId) => {
        console.log(rowId);
    }

    const columns = createConvocationManagementColumns({
        onToggleStatus: handleActiveAndInactive,
        onEdit: handleEditClick,
        onDelete: handleDeleteClick,
    });

    //
    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        setPage(1);
        const filteredData = convocations.filter((row) =>
            Object.values(row).some((value) =>
                value.toString().toLowerCase().includes(query)
            )
        );
        setFilteredConvocations(filteredData);
    };

    const handlePageChange = (nextPage, nextPageSize) => {
        setPage(nextPage);
        setPageSize(nextPageSize);
    };

    const reloadPage = () => {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    useEffect(() => {
        getConvocationList();
    }, [])

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Gestión de jornadas'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás ver el listado de las jornadas.'}
                backgroundInformationColor={'#40A581'}
            />

            <div className="container mt-lg-3">

                {loading && <Loading fullScreen text="Cargando Datos..." />}

                <ManagementTableSection
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    createLabel="Crear Jornada"
                    onCreate={() => navigate('/admin/create-convocation')}
                    columns={columns}
                    dataSource={filteredConvocations}
                    loading={loadingTable}
                    total={filteredConvocations.length}
                    currentPage={page}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
            </div>


        </>
    )
}

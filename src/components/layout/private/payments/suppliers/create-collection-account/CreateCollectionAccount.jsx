import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import { FaSave, FaStepBackward } from "react-icons/fa";

//Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";

//Enums
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";
import AlertComponent from "../../../../../../helpers/alert/AlertComponent";

const CHUNK_SIZE = 250;

export const CreateCollectionAccount = () => {

    const navigate = useNavigate();

    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [rowCount, setRowCount] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendingData, setSendingData] = useState(false);

    //
    const statusCollectionAccountColumns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "cub_id", headerName: "Cub", width: 90 },
        { field: "name", headerName: "Beneficiario", width: 300 },
        { field: "identification", headerName: "Identificacion", width: 200 },
        { field: "date", headerName: "Fecha", width: 150 },
        { field: "amount", headerName: "Cantidad de Productos", width: 150 },
        { field: "amount_of_money", headerName: "Valor", width: 150 },
    ]

    const getApprovedDeliveries = async (pageToFetch = 1, sizeToFetch) => {
        setLoading(true);
        try {
            const {data, status} = await paymentServices.getAllApprovedDeliveriesBySupplier(pageToFetch, sizeToFetch);
            console.log(data);
            if (status === ResponseStatusEnum.OK) {
                const rows = await normalizeRows(data.results);
                setDataTable(rows);
                setRowCount(data.count);
            }
        } catch (error) {
            console.error("Error creando la cuenta de cobro:", error);
        } finally {
            setLoading(false);
        }
    }

    const normalizeRows = async (data) => {
        return data.map((row) => ({
            id: row?.id,
            cub_id: row?.beneficiario?.id,
            name: `${row?.beneficiario?.nombre ?? ''} ${row?.beneficiario?.apellido ?? ''}`,
            identification: row?.beneficiario?.identificacion,
            date: row?.fecha_creacion.split('T')[0],
            amount: row?.cantidad_productos,
            amount_of_money: parseFloat(row?.valor).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
        }));
    }

    //Manejar selección de filas
    const handleSelectionChange = (newSelection) => {
        setSelectedIds(newSelection);
    };


    const handleSaveUsers = async () => {
        setSendingData(true);
        const blocks = splitIntoChunks(selectedIds, CHUNK_SIZE);

        try {
            await sendAllChunks(blocks);
            AlertComponent.success("Éxito", "Todas las cuentas de cobro se crearon correctamente.");
            navigate('admin/payments-suppliers');
        } catch (error) {
            console.error("Error al crear cuentas de cobro:", error);
            AlertComponent.error("Error", `${error}`);
        } finally {
            setSendingData(false);
        }
    };

    //Dividimos un array en bloques de tamaño n
    const splitIntoChunks = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    //Envíamos todos los bloques en serie (uno por uno)
    const sendAllChunks = async (chunks) => {
        for (let i = 0; i < chunks.length; i++) {
            await sendChunk(chunks[i], i);
        }
    };

    //Envíamos un solo bloque al backend
    const sendChunk = async (chunk, index) => {
        const payload = {
            entregas_ids: chunk,
        };

        const { data, status } = await paymentServices.createCollectionAccounts(payload);

        // ✅ Acepta 200 o 201 como exitosos
        if (![ResponseStatusEnum.OK, ResponseStatusEnum.CREATED].includes(status)) {
            AlertComponent.error("Error", `❌ Error en el bloque ${index + 1}: ${JSON.stringify(data)}`);
            throw new Error(`❌ Error en el bloque ${index + 1}: ${JSON.stringify(data)}`);
        }

        console.log(`✅ Bloque ${index + 1} creado con éxito`, data);
    };


    const onBack = () => {
        navigate(`/admin/payments-suppliers`);
    }

    useEffect(() => {
        getApprovedDeliveries(page + 1, pageSize);
    }, [page, pageSize]);

    return (
        <>
            <div className="container mt-lg-5">
                {sendingData && (
                    <div className="overlay">
                        <div className="loader">Enviando informacion...</div>
                    </div>
                )}

                <div style={{ height: 500, width: "100%" }}>
                    <DataGrid
                        checkboxSelection
                        rows={dataTable}
                        columns={statusCollectionAccountColumns}
                        loading={loading}
                        paginationMode="server"
                        rowCount={rowCount}
                        pageSizeOptions={[50, 100]}
                        paginationModel={{ page, pageSize }}
                        onPaginationModelChange={({ page, pageSize }) => {
                            setPage(page);
                            setPageSize(pageSize);
                        }}
                        onRowSelectionModelChange={handleSelectionChange}
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

                <div className="d-flex justify-content-end gap-2 mt-3" >
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => onBack()}
                    >
                        <FaStepBackward/> Atras
                    </Button>
                    <Button
                        variant="success"
                        size="md"
                        onClick={() => handleSaveUsers()}
                    >
                        <FaSave/> Crear cuenta de cobro
                    </Button>
                </div>
            </div>
        </>
    )
}
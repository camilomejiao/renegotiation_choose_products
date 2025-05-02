import { DataGrid } from "@mui/x-data-grid";
import {useEffect, useState} from "react";

const data = [
    {id: 1, cub_id: 123, name: 'camilo', identification: '1014208665', supplier: 'Jurado' },
    {id: 2, cub_id: 12345, name: 'camilo M', identification: '1014208666', supplier: 'Las gemelas' }
]

export const BeneficiaryList = ({ onRowSelect }) => {

    const [loading, setLoading] = useState(false);

    const beneficiaryColumns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "cub_id", headerName: "CUB", width: 80 },
        { field: "name", headerName: "Name", width: 400 },
        { field: "identification", headerName: "Identificación", width: 300 },
        { field: "supplier", headerName: "Proveedor", width: 300 },
    ];

    const getBeneficiaryList = () => {
        //setLoading(true);
        try {

        } catch (error) {

        } finally {
            //setLoading(true);
        }
    }

    const handleRowClick = (params) => {
        console.log(params.row, params.id);
        onRowSelect(params.id);
    }

    useEffect(() => {
        getBeneficiaryList()
    }, []);

    return (
        <>
            <div style={{height: 500, width: "100%"}}>
                <DataGrid
                    columns={beneficiaryColumns}
                    rows={data}
                    loading={loading}
                    onRowClick={handleRowClick}
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#40A581",
                            color: "white",
                            fontSize: "12px",
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
                            fontSize: "12px",
                            textAlign: "left",
                            justifyContent: "left",
                            alignItems: "flex-start",
                            display: "flex",
                        },
                        "& .MuiSelect-root": {
                            fontSize: "12px",
                            fontFamily: "Arial, sans-serif",
                            width: "100%",
                        },
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#E8F5E9",
                        },
                    }}
                />
            </div>
        </>
    )
}
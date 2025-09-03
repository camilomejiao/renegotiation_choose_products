import {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {Button} from "react-bootstrap";
import {DataGrid} from "@mui/x-data-grid";
import {FaSave} from "react-icons/fa";

//
import {HeaderImage} from "../../../../shared/header_image/HeaderImage";
import imgPeople from "../../../../../../assets/image/addProducts/people1.jpg";

//
import {getProductsPriceQuotesColumns} from "../../../../../../helpers/utils/NewProductColumns";

//Services

//Enum
import {handleError, showAlert} from "../../../../../../helpers/utils/utils";
import {formatPrice} from "../../../../../../helpers/utils/ProductColumns";


const PAGE_SIZE = 100;

const mockData = [
    {
        id: 1,
        plan: 'plan',
        categoria: 'categoria1',
        nombre: 'nombre1',
        unidad: 'unidad1',
        precio_min: 10000,
        precio_max: 20000,
        descripcion: '',
        marca: '',
    },
    {
        id: 2,
        plan: 'plan',
        categoria: 'categoria2',
        nombre: 'nombre2',
        unidad: 'unidad2',
        precio_min: 50000,
        precio_max: 100000,
        descripcion: '',
        marca: '',
    },
    {
        id: 3,
        plan: 'plan',
        categoria: 'categoria3',
        nombre: 'nombre3',
        unidad: 'unidad3',
        precio_min: 750000,
        precio_max: 1000000,
        descripcion: '',
        marca: '',
    }
]

export const ProductPriceQuotes = () => {

    const { userAuth } = useOutletContext();
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const getProductList = async () => {
        try {
            // const { data } = await newProductServices.getProductPriceQuoteList(1);
            const products = await normalizeRows(mockData);
            setRows(products);
            setFilteredRows(products);
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
        }
    };

    const normalizeRows = async (data) => {
        try {
            return data.map((row) => ({
                id: row.id,
                plan: row.plan,
                category: row.categoria,
                name: row.nombre,
                unit: row.unidad,
                description: row.descripcion ?? "",
                brand: row.marca ?? "",
                price: 0,
                precio_min: Number(row?.precio_min),
                precio_max: Number(row?.precio_max),
            }));
        } catch (error) {
            console.error('Error al normalizar filas:', error);
            return [];
        }
    };

    const baseColumns = getProductsPriceQuotesColumns();

    const columns = [...baseColumns];

    const handleRowUpdate = (newRow) => {
        const pMin = Number(newRow.precio_min ?? 0);
        const pMax = Number(newRow.precio_max ?? Infinity);
        const price = Number(newRow.price ?? 0);

        if (price && (price < pMin || price > pMax)) {
            handleError(
                "Valor fuera de rango",
                //`El precio debe estar entre ${formatPrice(pMin)} y ${formatPrice(pMax)}.`
            );
        }
        //Actualiza estado principal y filtrado
        setRows((prev) => prev.map((r) => (r.id === newRow.id ? newRow : r)));
        setFilteredRows((prev) => prev.map((r) => (r.id === newRow.id ? newRow : r)));
        return newRow; // requerido por MUI
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filteredData = rows.filter((row) =>
            Object.values(row).some((value) =>
                value.toString().toLowerCase().includes(query)
            )
        );
        setFilteredRows(filteredData);
    };


    const handleSaveProducts = async () => {
        try {
            setLoading(true);

            const invalids = rows.filter(r => {
                const price = Number(r?.price);
                const pMin = Number(r?.precio_min);
                const pMax = Number(r?.precio_max);
                return price && (price < pMin || price > pMax);
            });

            if (invalids.length) {
                handleError(
                    "Revisa precios",
                    `Tienes ${invalids.length} producto(s) con precio fuera de rango.`
                );
                setLoading(false);
                return;
            }

            const emptyFields = rows.some(r => {
                return !r.description || !r.brand || !r.price
            });

            if (emptyFields) {
                handleError(
                    "Revisa campos",
                    `Tienes Algun campo vacio.`
                );
                setLoading(false);
                return;
            }

            console.log("rows completos a guardar:", rows);

            let sendData = {
                proveedor_id : 1,
                productos: rows
            }

            showAlert('Bien hecho!', 'Productos actualizados con éxito.');
        } catch (error) {
            handleError('Error', 'Error al guardar los productos.');
        } finally {
            setLoading(false);
        }
    };

    //Cargar datos iniciales
    useEffect(() => {
        getProductList();
    }, []);

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader={"¡Empieza a agregar tus productos!"}
                    bannerIcon={''}
                    backgroundIconColor={''}
                    bannerInformation={''}
                    backgroundInformationColor={''}
                />

                <div className="container mt-lg-3">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mt-3 mb-3">
                        <div className="d-flex flex-column flex-md-row w-100 w-md-auto">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="input-responsive me-2"
                            />
                        </div>
                    </div>

                    {loading && (
                        <div className="overlay">
                            <div className="loader">Guardando Productos...</div>
                        </div>
                    )}

                    <div style={{height: 600, width: "100%"}}>
                        <DataGrid
                            rows={filteredRows}
                            columns={columns}
                            processRowUpdate={handleRowUpdate}
                            editMode="row"
                            pagination
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

                    {/* Botón Guardar */}
                    <div className="d-flex align-items-end mt-3">
                        <Button
                            variant="success"
                            size="md"
                            onClick={handleSaveProducts}
                            className="ms-auto"
                            disabled={loading}
                        >
                            <FaSave/> {loading ? "Guardando..." : "Guardar Productos"}
                        </Button>
                    </div>

                </div>

            </div>
        </>
    )
}
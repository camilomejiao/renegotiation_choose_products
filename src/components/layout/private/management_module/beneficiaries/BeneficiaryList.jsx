import { useCallback, useEffect, useState } from "react";
import StandardTable from "../../../../shared/StandardTable";

//Utils
import { getBeneficiaryColumn } from "../../../../../helpers/utils/ManagementColumns";

const mockData = [
  {
    id: 1,
    nombre: "Camilo 1",
    apellido: "Mejia 1",
    cub: 2345,
    cedula: 12345,
    email: "cmejia1@gmail.com",
    celular: "3218776613",
    status: "ACTIVO",
    resolucion: "resolucion",
    departamento: "PUTUMAYO",
    municipio: "PUERTO ASIS",
  },
  {
    id: 2,
    nombre: "Camilo 2",
    apellido: "Mejia 2",
    cub: 2345,
    cedula: 12345,
    email: "cmejia2@gmail.com",
    celular: "3218776613",
    status: "ACTIVO",
    resolucion: "resolucion",
    departamento: "PUTUMAYO",
    municipio: "PUERTO ASIS",
  },
  {
    id: 3,
    nombre: "Camilo 3",
    apellido: "Mejia 3",
    cub: 2345,
    cedula: 12345,
    email: "cmejia3@gmail.com",
    celular: "3218776613",
    status: "ACTIVO",
    resolucion: "resolucion",
    departamento: "PUTUMAYO",
    municipio: "PUERTO ASIS",
  },
];

export const BeneficiaryList = () => {
  const [beneficiariesRow, setBeneficiariesRow] = useState([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  const normalizeRows = useCallback(async (payload) => {
    return payload.map((row) => ({
      id: row?.id,
      name: row?.nombre,
      last_name: row?.apellido,
      cub: row?.cub,
      identification_number: row?.cedula,
      email: row?.email,
      cellphone: row?.celular,
      dept: row?.departamento,
      muni: row?.municipio,
      status: row?.status,
      resolution: row?.resolucion,
    }));
  }, []);

  const getBeneficiaryList = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingTable(true);
      const beneficiaries = await normalizeRows(mockData);
      console.log("users: ", beneficiaries);
      setBeneficiariesRow(beneficiaries);
      setFilteredBeneficiaries(beneficiaries);
    } catch (error) {
      console.error("Error al obtener la lista de beneficiarios:", error);
    } finally {
      setLoading(false);
      setLoadingTable(false);
    }
  }, [normalizeRows]);

  //
  const baseColumns = getBeneficiaryColumn();
  const columns = [...baseColumns];

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredData = beneficiariesRow.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(query)
      )
    );
    setFilteredBeneficiaries(filteredData);
  };

  useEffect(() => {
    getBeneficiaryList();
  }, [getBeneficiaryList]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
          <input
            type="text"
            placeholder="Buscar beneficiarios..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="form-control"
            style={{ width: '300px' }}
          />
        </div>
      </div>

      {loading && (
        <div className="overlay">
          <div className="loader">Cargando Datos...</div>
        </div>
      )}

      <StandardTable
        rows={filteredBeneficiaries}
        columns={columns}
        loading={loadingTable}
        noRowsText="No hay beneficiarios disponibles"
        customProps={{
          editMode: "row",
          pageSizeOptions: [10, 25, 50, 100],
          initialState: {
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          },
        }}
        enableDynamicHeight={true}
      />
    </>
  );
};

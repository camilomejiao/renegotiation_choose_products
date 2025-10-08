import { DataGrid } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";

//img
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";

export const ListAccountOfSuppliers = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [rowCount, setRowCount] = useState(0);

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "collection_account",
      headerName: "N° Cuenta de Cobro",
      width: 180,
    },
    { field: "date", headerName: "Fecha Creación", width: 180 },
    { field: "supplier_nit", headerName: "Nit", width: 180 },
    { field: "supplier_name", headerName: "Proveedor", width: 380 },
    { field: "total", headerName: "Valor Total", width: 200 },
  ];

  const normalizeRows = useCallback(async (data) => {
    return data.map((row) => ({
      id: row?.id,
      collection_account: row?.numero,
      date: row?.fecha_cuenta_cobro.split("T")[0],
      supplier_name: row?.nombre_proveedor,
      supplier_nit: row?.nit_proveedor,
      total: `$ ${parseFloat(row?.valor_total).toLocaleString()}`,
    }));
  }, []);

  const getAccountOfSuppliers = useCallback(
    async (pageToFetch = 1, sizeToFetch = 100) => {
      setLoading(true);
      try {
        const { data, status } = await paymentServices.getCollectionAccounts(
          pageToFetch,
          sizeToFetch
        );
        if (status === ResponseStatusEnum.OK) {
          const rows = await normalizeRows(data.results);
          setDataTable(rows);
          setRowCount(data.count);
        }
      } catch (error) {
        console.error("Error obteniendo las entregas:", error);
      } finally {
        setLoading(false);
      }
    },
    [normalizeRows]
  );

  const handleRowClick = (params) => {
    navigate(`/admin/fiduciary/collection-account-details/${params.id}`);
  };

  useEffect(() => {
    getAccountOfSuppliers(page + 1, pageSize);
  }, [getAccountOfSuppliers, page, pageSize]);

  return (
    <>
      <HeaderImage
        imageHeader={imgPayments}
        titleHeader={"Fiduciara"}
        bannerIcon={imgAdd}
        backgroundIconColor={"#2148C0"}
        bannerInformation={"Aquí podrás ver el lisatdo de cuentas de cobro."}
        backgroundInformationColor={"#40A581"}
      />

      <div className="container mt-lg-5">
        <div className="data-grid-card" style={{ height: 500 }}>
          <DataGrid
            className="data-grid"
            rows={dataTable}
            columns={columns}
            loading={loading}
            paginationMode="server"
            rowCount={rowCount}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            }}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </>
  );
};

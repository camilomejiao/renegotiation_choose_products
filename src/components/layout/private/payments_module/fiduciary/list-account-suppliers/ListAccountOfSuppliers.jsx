import { useCallback, useEffect, useState } from "react";
import { FaUniversity } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StandardTable from "../../../../../shared/StandardTable";

//Components
import { Breadcrumb } from "../../../../../shared/Breadcrumb";
import { ModernBanner } from "../../../../../shared/ModernBanner";

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
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "collection_account",
      headerName: "N° Cuenta de Cobro",
      width: 180,
    },
    { field: "date", headerName: "Fecha Creación", width: 180 },
    { field: "supplier_nit", headerName: "Nit", width: "auto" },
    { field: "supplier_name", headerName: "Proveedor", width: "auto" },
    {
      field: "total",
      headerName: "Valor Total",
      width: "auto",
      align: "left",
      headerAlign: "left",
    },
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
      <Breadcrumb />
      <div className="container-fluid px-4">
        <ModernBanner
          imageHeader={imgPayments}
          titleHeader="​"
          bannerIcon={imgAdd}
          bannerInformation="Fiduciaria"
          backgroundInformationColor="#2148C0"
          infoText="Aquí podrás ver el listado de cuentas de cobro y gestionar los procesos fiduciarios."
        />

        <div className="mb-4 ml-4 pl-3">
          <h3 className="text-primary fw-bold mb-3">
            <FaUniversity className="me-2" />
            Cuentas de Cobro
          </h3>
        </div>

        <StandardTable
          rows={dataTable}
          columns={columns}
          loading={loading}
          customProps={{
            paginationMode: "server",
            rowCount: rowCount,
            pageSizeOptions: [10, 25, 50, 100],
            paginationModel: { page, pageSize },
            onPaginationModelChange: ({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            },
            onRowClick: handleRowClick,
          }}
          enableDynamicHeight={true}
        />
      </div>
    </>
  );
};

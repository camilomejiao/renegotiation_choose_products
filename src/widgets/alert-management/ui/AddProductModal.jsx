import { useMemo } from "react";
import { Modal } from "../../../shared/ui/modal";
import { SmartTable } from "../../../shared/ui/smart-table";
import { getAddProductColumns } from "../model/getAddProductColumns";

export const AddProductModal = ({
  isOpen,
  onClose,
  rows = [],
  loading = false,
  currentPage,
  pageSize,
  totalRecords = 0,
  onPageChange,
  onAdd,
}) => {
  const columns = useMemo(() => getAddProductColumns({ onAdd }), [onAdd]);

  return (
    <Modal
      title="Adicionar producto"
      subTitle="Productos de la jornada sin tipo de gestión asignado."
      isOpen={isOpen}
      onCloseModal={onClose}
      footer={null}
      width={960}
      centered
      maxBodyHeight="70vh"
    >
      <SmartTable
        rowKey="id"
        columns={columns}
        dataSource={rows}
        loading={loading}
        total={totalRecords}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        showPagination
        pageSizeOptions={["10", "20", "50"]}
        defaultPageSize="10"
        showToolbar={false}
        enableRowSelection={false}
        showColumnSettings={false}
        emptyText="No hay productos disponibles para adicionar."
      />
    </Modal>
  );
};
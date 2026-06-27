import { SmartTable } from "../../../shared/ui/smart-table";
import { TABLE_SCROLL_X } from "../model/alertManagementConstants";
import { TableCard, TableContent, TableDescription, TableHeader, TableTitle } from "./table.styles";

export const AlertManagementTable = ({ columns, dataSource, loading, visible }) => {
  if (!visible) return null;
  return (
    <TableCard bordered={false}>
      <TableHeader>
        <TableTitle>Gestiones de alerta</TableTitle>
        <TableDescription>Listado de solicitudes documentales de productos alertados.</TableDescription>
      </TableHeader>
      <TableContent>
        <SmartTable
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          scroll={{ x: TABLE_SCROLL_X }}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          showToolbar={false}
          enableRowSelection={false}
        />
      </TableContent>
    </TableCard>
  );
};
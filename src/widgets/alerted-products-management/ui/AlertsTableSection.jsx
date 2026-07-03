import { PlusOutlined } from "@ant-design/icons";

import { SmartTable } from "../../../shared/ui/smart-table";
import { MANAGEMENT_VARIANT } from "../model/constants";
import { SectionCard, SectionTitle } from "./common.styles";
import {
  AlertsAddButton,
  AlertsSectionHeader,
  AlertsTableWrapper,
  TableValidationBanner,
} from "./AlertsTableSection.styles";

const SCROLL_X = {
  [MANAGEMENT_VARIANT.PRICE_ADJUSTMENT]: 2070,
  [MANAGEMENT_VARIANT.HOMOLOGATION]: 2220,
  [MANAGEMENT_VARIANT.DEFAULT]: 1900,
};

export const AlertsTableSection = ({ variant, columns, dataSource, onAddItem }) => (
  <SectionCard>
    <AlertsSectionHeader>
      <SectionTitle>Alertas a Gestionar</SectionTitle>
      <AlertsAddButton type="primary" icon={<PlusOutlined />} onClick={onAddItem}>
        Añadir item
      </AlertsAddButton>
    </AlertsSectionHeader>
    <AlertsTableWrapper>
      <SmartTable
        rowKey="id"
        columns={columns}
        columnWidthMode="fixed"
        dataSource={dataSource}
        total={dataSource.length}
        showPagination
        pageSizeOptions={["10", "20", "50"]}
        defaultPageSize="10"
        enableRowSelection={false}
        showToolbar={false}
        showColumnSettings={false}
        showTableResize={false}
        showReload={false}
        scroll={{ x: SCROLL_X[variant] ?? SCROLL_X[MANAGEMENT_VARIANT.DEFAULT], y: 400 }}
        emptyText="No hay alertas para el tipo de gestión seleccionado."
      />
    </AlertsTableWrapper>
    {variant === MANAGEMENT_VARIANT.PRICE_ADJUSTMENT ? (
      <TableValidationBanner>
        <span>
          <strong>Validación:</strong> el Nuevo Precio de Venta debe ser numérico,
          mayor o igual al Precio mínimo y menor o igual al Precio máximo.
        </span>
      </TableValidationBanner>
    ) : null}
    {variant === MANAGEMENT_VARIANT.HOMOLOGATION ? (
      <TableValidationBanner>
        <span>
          <strong>Validación:</strong> cada ítem debe tener un producto homologado
          asignado mediante el botón <strong>Homologar por</strong>.
        </span>
      </TableValidationBanner>
    ) : null}
  </SectionCard>
);
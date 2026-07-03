import { useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Modal as AntdModal, Input, Select } from "antd";

import { SmartTable } from "../../../shared/ui/smart-table";
import { wrapTitle } from "../../../shared/ui/lib/wrapTitle";
import { formatCurrency } from "../lib/format";
import {
  AddAlertRowButton,
  FieldGroup,
  FieldLabel,
  ModalInfoBanner,
  SecondaryActionButton,
} from "./common.styles";
import { HomologationSearchGrid, SearchButton } from "./HomologationSearchModal.styles";

const EMPTY_FILTERS = {
  plan: undefined,
  proveedor: "",
  nombreProducto: "",
  codigoProducto: "",
};

const PLAN_OPTIONS = [
  { value: "AGRICOLA", label: "AGRÍCOLA" },
  { value: "PECUARIO", label: "PECUARIO" },
];

const matches = (value, term) =>
  !term || String(value ?? "").toLowerCase().includes(term.toLowerCase().trim());

// TODO(endpoint): la fuente de datos real de este buscador (catálogo / estudio de
// mercado) se conectará luego. Por ahora se filtra en cliente sobre `dataSource`.
export const HomologationSearchModal = ({
  isOpen,
  onClose,
  onSelect,
  dataSource = [],
  loading = false,
  journeyLabel = "",
}) => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(null);

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const results = useMemo(() => {
    if (!applied) return dataSource;
    return dataSource.filter(
      (row) =>
        matches(row.supplier, applied.proveedor) &&
        matches(row.productName, applied.nombreProducto) &&
        matches(row.productId, applied.codigoProducto)
    );
  }, [dataSource, applied]);

  const handleSearch = () => setApplied({ ...filters });

  const handleClose = () => {
    setFilters(EMPTY_FILTERS);
    setApplied(null);
    onClose?.();
  };

  const columns = useMemo(
    () => [
      {
        title: "Acción",
        key: "action",
        width: 110,
        align: "center",
        fixed: "left",
        render: (_, record) => (
          <AddAlertRowButton onClick={() => onSelect?.(record)}>Añadir</AddAlertRowButton>
        ),
      },
      {
        title: "Proveedor",
        dataIndex: "supplier",
        key: "supplier",
        width: 160,
        align: "center",
        render: (v) => v || "—",
      },
      {
        title: wrapTitle("ID", "Producto"),
        dataIndex: "productId",
        key: "productId",
        width: 120,
        align: "center",
        render: (v) => v || "—",
      },
      {
        title: wrapTitle("Nombre", "Producto"),
        dataIndex: "productName",
        key: "productName",
        width: 220,
        align: "center",
        render: (v) => v || "—",
      },
      {
        title: "Unidad",
        dataIndex: "unitOfMeasure",
        key: "unitOfMeasure",
        width: 110,
        align: "center",
        render: (v) => v || "—",
      },
      {
        title: "Marca",
        dataIndex: "commercialBrand",
        key: "commercialBrand",
        width: 120,
        align: "center",
        render: (v) => v || "—",
      },
      {
        title: wrapTitle("Precio", "mínimo"),
        dataIndex: "minimumPrice",
        key: "minimumPrice",
        width: 120,
        align: "right",
        render: formatCurrency,
      },
      {
        title: wrapTitle("Precio", "máximo"),
        dataIndex: "maximumPrice",
        key: "maximumPrice",
        width: 120,
        align: "right",
        render: formatCurrency,
      },
      {
        title: wrapTitle("Valor unitario", "venta"),
        dataIndex: "saleUnitValue",
        key: "saleUnitValue",
        width: 140,
        align: "right",
        render: formatCurrency,
      },
      {
        title: wrapTitle("Valor Catálogo", "Jornada"),
        dataIndex: "fairCatalogValue",
        key: "fairCatalogValue",
        width: 150,
        align: "right",
        render: formatCurrency,
      },
    ],
    [onSelect]
  );

  return (
    <AntdModal
      open={isOpen}
      onCancel={handleClose}
      title="Búsqueda avanzada de producto homologado"
      footer={<SecondaryActionButton onClick={handleClose}>Cerrar</SecondaryActionButton>}
      width={1100}
      destroyOnClose
    >
      <ModalInfoBanner>
        Busque y seleccione un producto previamente existente en el catálogo o estudio
        de mercado para asignarlo como producto homologado.
      </ModalInfoBanner>

      <HomologationSearchGrid>
        <FieldGroup>
          <FieldLabel>Jornada</FieldLabel>
          <Select
            value={journeyLabel || undefined}
            placeholder="Seleccione jornada"
            options={journeyLabel ? [{ value: journeyLabel, label: journeyLabel }] : []}
            disabled
            style={{ width: "100%" }}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Plan</FieldLabel>
          <Select
            value={filters.plan}
            placeholder="Seleccione plan"
            onChange={(value) => setFilter("plan", value)}
            allowClear
            style={{ width: "100%" }}
            options={PLAN_OPTIONS}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Proveedor</FieldLabel>
          <Input
            value={filters.proveedor}
            placeholder="Nombre del proveedor"
            onChange={(e) => setFilter("proveedor", e.target.value)}
            allowClear
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Nombre producto</FieldLabel>
          <Input
            value={filters.nombreProducto}
            placeholder="Nombre del producto"
            onChange={(e) => setFilter("nombreProducto", e.target.value)}
            allowClear
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Código producto</FieldLabel>
          <Input
            value={filters.codigoProducto}
            placeholder="Ingrese código"
            onChange={(e) => setFilter("codigoProducto", e.target.value)}
            allowClear
          />
        </FieldGroup>

        <SearchButton icon={<SearchOutlined />} onClick={handleSearch}>
          Buscar
        </SearchButton>
      </HomologationSearchGrid>

      <SmartTable
        rowKey="id"
        columns={columns}
        columnWidthMode="fixed"
        dataSource={results}
        total={results.length}
        loading={loading}
        showPagination
        pageSizeOptions={["10", "20", "50"]}
        defaultPageSize="10"
        showToolbar={false}
        showColumnSettings={false}
        showTableResize={false}
        showReload={false}
        scroll={{ x: 1370, y: 400 }}
        emptyText="No hay productos para los criterios de búsqueda."
      />
    </AntdModal>
  );
};
import { useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Modal as AntdModal, Input, Select } from "antd";

import { SmartTable } from "../../../shared/ui/smart-table";
import { wrapTitle } from "../../../shared/ui/lib/wrapTitle";
import { formatCurrency } from "../lib/format";
import { useHomologationFilters } from "../model/useHomologationFilters";
import {
  AddAlertRowButton,
  FieldGroup,
  FieldLabel,
  ModalInfoBanner,
  SecondaryActionButton,
} from "./common.styles";
import { HomologationSearchGrid, SearchButton } from "./HomologationSearchModal.styles";

const matches = (value, term) =>
  !term || String(value ?? "").toLowerCase().includes(term.toLowerCase().trim());

// TODO(endpoint): la fuente de datos real de la TABLA de resultados (catálogo /
// estudio de mercado) se conectará luego. Por ahora la tabla se filtra en cliente
// sobre `dataSource`. Los filtros Jornada/Plan/Proveedor ya consumen sus servicios.
export const HomologationSearchModal = ({
  isOpen,
  onClose,
  onSelect,
  dataSource = [],
  loading = false,
  defaultJourney = null,
}) => {
  const {
    journeyOptions,
    journeyLoading,
    selectedJourney,
    changeJourney,
    planOptions,
    planLoading,
    selectedPlan,
    changePlan,
    supplierOptions,
    supplierLoading,
    selectedSupplier,
    changeSupplier,
  } = useHomologationFilters({ isOpen, defaultJourney });

  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState(null);

  const results = useMemo(() => {
    if (!applied) return dataSource;
    const term = applied.search;
    return dataSource.filter(
      (row) =>
        matches(row.supplier, applied.proveedor) &&
        (!term || matches(row.productName, term) || matches(row.productId, term))
    );
  }, [dataSource, applied]);

  const handleSearch = () =>
    setApplied({
      proveedor: selectedSupplier?.label ?? "",
      search: search.trim(),
    });

  const handleClose = () => {
    setSearch("");
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
            value={selectedJourney?.value}
            placeholder="Seleccione jornada"
            options={journeyOptions}
            loading={journeyLoading}
            onChange={(_, option) => changeJourney(option || null)}
            showSearch
            optionFilterProp="label"
            allowClear
            style={{ width: "100%" }}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Plan</FieldLabel>
          <Select
            value={selectedPlan?.value}
            placeholder="Seleccione plan"
            options={planOptions}
            loading={planLoading}
            onChange={(_, option) => changePlan(option || null)}
            disabled={!selectedJourney}
            showSearch
            optionFilterProp="label"
            allowClear
            style={{ width: "100%" }}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Proveedor</FieldLabel>
          <Select
            value={selectedSupplier?.value}
            placeholder="Seleccione proveedor"
            options={supplierOptions}
            loading={supplierLoading}
            onChange={(_, option) => changeSupplier(option || null)}
            disabled={!selectedJourney}
            showSearch
            optionFilterProp="label"
            allowClear
            style={{ width: "100%" }}
          />
        </FieldGroup>

        <FieldGroup style={{ gridColumn: "span 2" }}>
          <FieldLabel>Buscar producto</FieldLabel>
          <Input
            value={search}
            placeholder="Buscar por Nombre de producto o Código de producto"
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined />}
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
        enableRowSelection={false}
        scroll={{ x: 1370, y: 400 }}

        emptyText="No hay productos para los criterios de búsqueda."
      />
    </AntdModal>
  );
};
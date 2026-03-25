import {
  CurrencyCell,
  ObservationCell,
  StatusCell,
} from "../../../shared/ui/review-table-cells";
import { isProductPriceQuoteLocked } from "../lib/normalizeProductPriceQuoteRows";
import {
  EditablePriceCell,
  EditableTextAreaCell,
  EditableTextCell,
  ReadOnlyTextCell,
} from "../ui/ProductPriceQuoteCells";

export const getProductPriceQuotesColumns = ({ onRowChange }) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
    align: "center",
  },
  {
    title: "CATEGORIA",
    dataIndex: "category",
    key: "category",
    width: 240,
    ellipsis: false,
    render: (value) => <ReadOnlyTextCell value={value} />,
  },
  {
    title: "NOMBRE PRODUCTO",
    dataIndex: "name",
    key: "name",
    width: 320,
    ellipsis: false,
    render: (value) => <ReadOnlyTextCell value={value} />,
  },
  {
    title: "UNIDAD",
    dataIndex: "unit",
    key: "unit",
    width: 160,
    ellipsis: false,
    render: (value) => <ReadOnlyTextCell value={value} />,
  },
  {
    title: "DESCRIPCION",
    dataIndex: "description",
    key: "description",
    width: 360,
    ellipsis: false,
    render: (value, record) => (
      <EditableTextAreaCell
        value={value}
        record={record}
        field="description"
        onRowChange={onRowChange}
        disabled={isProductPriceQuoteLocked(record)}
      />
    ),
  },
  {
    title: "MARCA",
    dataIndex: "brand",
    key: "brand",
    width: 220,
    ellipsis: false,
    render: (value, record) => (
      <EditableTextCell
        value={value}
        record={record}
        field="brand"
        onRowChange={onRowChange}
        disabled={isProductPriceQuoteLocked(record)}
      />
    ),
  },
  {
    title: "PRECIO MIN",
    dataIndex: "price_min",
    key: "price_min",
    width: 140,
    align: "right",
    render: (value) => <CurrencyCell value={value} />,
  },
  {
    title: "PRECIO MAX",
    dataIndex: "price_max",
    key: "price_max",
    width: 140,
    align: "right",
    render: (value) => <CurrencyCell value={value} />,
  },
  {
    title: "VALOR",
    dataIndex: "price",
    key: "price",
    width: 180,
    align: "right",
    render: (value, record) => (
      <EditablePriceCell
        value={value}
        record={record}
        onRowChange={onRowChange}
        disabled={isProductPriceQuoteLocked(record)}
      />
    ),
  },
  {
    title: "ESTADO",
    dataIndex: "state",
    key: "state",
    width: 140,
    align: "center",
    render: (value) => <ReadOnlyTextCell value={value} />,
  },
  {
    title: "OBSERVACION SUPERVISION",
    dataIndex: "observations_supervision",
    key: "observations_supervision",
    width: 320,
    ellipsis: false,
    render: (value) => <ObservationCell value={value} />,
  },
  {
    title: "ESTADO SUPERVISION",
    dataIndex: "status_supervision",
    key: "status_supervision",
    width: 160,
    align: "center",
    render: (value) => <StatusCell value={value} />,
  },
];

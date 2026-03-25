import {
  CurrencyCell,
  EnvironmentalAmountCell,
  EnvironmentalFlagCell,
  ObservationCell,
  ReadOnlyCell,
  StatusCell,
} from "../ui/EnvironmentalTableCells";

const BASE_COLUMNS = [
  { title: "ID", dataIndex: "id", key: "id", width: 90, align: "center" },
  {
    title: "CATEGORIA",
    dataIndex: "category",
    key: "category",
    width: 220,
    ellipsis: false,
    render: (value) => <ReadOnlyCell value={value} />,
  },
  {
    title: "NOMBRE",
    dataIndex: "name",
    key: "name",
    width: 260,
    ellipsis: false,
    render: (value) => <ReadOnlyCell value={value} />,
  },
  {
    title: "DESCRIPCION",
    dataIndex: "description",
    key: "description",
    width: 260,
    ellipsis: false,
    render: (value) => <ReadOnlyCell value={value} />,
  },
  {
    title: "MARCA",
    dataIndex: "brand",
    key: "brand",
    width: 180,
    ellipsis: false,
    render: (value) => <ReadOnlyCell value={value} />,
  },
  {
    title: "UNIDAD",
    dataIndex: "unit",
    key: "unit",
    width: 140,
    ellipsis: false,
    render: (value) => <ReadOnlyCell value={value} />,
  },
  {
    title: "PRECIO MIN",
    dataIndex: "price_min",
    key: "price_min",
    width: 150,
    align: "right",
    render: (value) => <CurrencyCell value={value} />,
  },
  {
    title: "PRECIO MAX",
    dataIndex: "price_max",
    key: "price_max",
    width: 150,
    align: "right",
    render: (value) => <CurrencyCell value={value} />,
  },
  {
    title: "VALOR",
    dataIndex: "price",
    key: "price",
    width: 150,
    align: "right",
    render: (value) => <CurrencyCell value={value} />,
  },
  {
    title: "ESTADO",
    dataIndex: "status_environmental",
    key: "status_environmental",
    width: 140,
    align: "center",
    render: (value) => <StatusCell value={value} />,
  },
  {
    title: "OBSERVACION AMBIENTAL",
    dataIndex: "observations_environmental",
    key: "observations_environmental",
    width: 260,
    ellipsis: false,
    render: (value) => <ObservationCell value={value} />,
  },
];

export const getCatalogEnvironmentalColumns = ({
  environmentalCategories = [],
  onRowFieldChange,
}) => {
  const dynamicColumns = environmentalCategories.map((category) => {
    const categoryCode = String(category?.codigo || "");

    return {
      title: `${categoryCode}: ${category?.descripcion || ""}`,
      dataIndex: categoryCode,
      key: categoryCode,
      width: 210,
      render: (value, record) => (
        <EnvironmentalFlagCell
          value={value}
          record={record}
          columnKey={categoryCode}
          onChange={onRowFieldChange}
        />
      ),
    };
  });

  const dynamicAmountColumn = {
    title: "VALOR CATEGORIA AMBIENTAL",
    dataIndex: "customValue",
    key: "custom_category_value",
    width: 280,
    render: (_value, record) => (
      <EnvironmentalAmountCell
        record={record}
        categoryOptions={environmentalCategories.map((category) => ({
          value: String(category.codigo),
          label: category.descripcion,
        }))}
        onChange={onRowFieldChange}
      />
    ),
  };

  return [...BASE_COLUMNS, ...dynamicColumns, dynamicAmountColumn];
};

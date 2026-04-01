import { Typography, Tag } from "antd";
import { dataIndexToKey, getValueByDataIndex } from "./getValueByDataIndex";
import { formatByType } from "./formatByType";

const { Link, Text } = Typography;

const isEmptyValue = (value) => value === null || value === undefined;

const createRenderer = (column, defaultText) => {
  return (_value, record) => {
    const cellValue = getValueByDataIndex(record, column.dataIndex);

    if (column.render) {
      return column.render(cellValue, record);
    }

    if (isEmptyValue(cellValue)) {
      return defaultText;
    }

    if (["currency", "timestamp", "date", "time", "datetime-in-timezone"].includes(column.type)) {
      return formatByType(column.type, cellValue);
    }

    if (column.type === "link") {
      return (
        <Link onClick={() => column.onLinkClick?.(cellValue, record)}>
          {cellValue}
        </Link>
      );
    }

    if (column.type === "tag") {
      return <Tag color={column.getTagColor?.(cellValue, record)}>{String(cellValue).toUpperCase()}</Tag>;
    }

    if (column.copyable) {
      return <Text copyable>{cellValue}</Text>;
    }

    return cellValue;
  };
};

export const mapToAntdColumns = ({
  columns = [],
  defaultText = "---",
  columnWidthMode = "fixed",
}) => {
  return columns.map((column) => {
    const resolvedWidth =
      columnWidthMode === "adaptive"
        ? undefined
        : Number(column?.width) > 0
          ? column.width
          : 120;

    return {
      ...column,
      key: column.key || dataIndexToKey(column.dataIndex),
      width: resolvedWidth,
      ellipsis: column.ellipsis ?? true,
      render: createRenderer(column, defaultText),
    };
  });
};

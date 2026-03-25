import React, { useMemo } from "react";
import { Button, Checkbox, Divider, Flex, Popover, Tooltip } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { dataIndexToKey } from "../lib/getValueByDataIndex";

const move = (items, from, to) => {
  const clone = [...items];
  const [item] = clone.splice(from, 1);
  clone.splice(to, 0, item);
  return clone;
};

export const ColumnSettings = ({
  columns,
  onChange,
  resetColumns,
  label = "Columnas",
}) => {
  const entries = useMemo(
    () =>
      columns.map((column, index) => ({
        index,
        key: dataIndexToKey(column.dataIndex),
        title: column.title,
        hidden: Boolean(column.hidden),
      })),
    [columns]
  );

  const onToggle = (key) => {
    const next = columns.map((column) => {
      if (dataIndexToKey(column.dataIndex) !== key) {
        return column;
      }

      return {
        ...column,
        hidden: !column.hidden,
      };
    });

    onChange(next);
  };

  const onMove = (from, to) => {
    onChange(move(columns, from, to));
  };

  const content = (
    <Flex vertical gap={8} style={{ minWidth: 320 }}>
      {entries.map((entry) => (
        <Flex key={entry.key} align="center" justify="space-between" gap={8}>
          <Checkbox checked={!entry.hidden} onChange={() => onToggle(entry.key)}>
            {entry.title}
          </Checkbox>
          <Flex gap={4}>
            <Tooltip title="Mover arriba">
              <Button
                size="small"
                icon={<ArrowUpOutlined />}
                disabled={entry.index === 0}
                onClick={() => onMove(entry.index, entry.index - 1)}
              />
            </Tooltip>
            <Tooltip title="Mover abajo">
              <Button
                size="small"
                icon={<ArrowDownOutlined />}
                disabled={entry.index === entries.length - 1}
                onClick={() => onMove(entry.index, entry.index + 1)}
              />
            </Tooltip>
          </Flex>
        </Flex>
      ))}
      <Divider style={{ margin: "8px 0" }} />
      <Button type="default" icon={<ReloadOutlined />} onClick={resetColumns}>
        Restaurar columnas
      </Button>
    </Flex>
  );

  return (
    <Popover placement="bottomRight" trigger="click" content={content}>
      <Button type="text" icon={<SettingOutlined />}>
        {label}
      </Button>
    </Popover>
  );
};

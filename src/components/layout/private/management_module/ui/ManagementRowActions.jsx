import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Popconfirm, Space } from "antd";
import { useThemeMode } from "../../../../../shared/ui/theme/ThemeProvider";
import { themeTokens } from "../../../../../shared/ui/theme/tokens";
import {
  DangerHoverActionButton,
  PrimaryHoverActionButton,
  WarningActionButton,
} from "./ManagementRowActions.styles";

export const ManagementRowActions = ({
  record,
  onToggleStatus,
  onEdit,
  onDelete,
  deleteMessage = "¿Deseas eliminar este registro?",
}) => {
  const { mode } = useThemeMode();
  const colors = (themeTokens[mode] || themeTokens.light).colors;

  return (
    <Space size={8}>
      <PrimaryHoverActionButton
        shape="circle"
        icon={record.status ? <StopOutlined /> : <CheckCircleOutlined />}
        onClick={() => onToggleStatus?.(record)}
        title={record.status ? "Inactivar" : "Activar"}
        $borderColor={colors.actionBlueBg}
        $textColor={colors.actionBlueBg}
        $hoverBg={colors.actionBlueBg}
        $hoverText={colors.actionBlueText}
      />
      <WarningActionButton
        shape="circle"
        icon={<EditOutlined />}
        onClick={() => onEdit?.(record.id)}
        title="Editar"
        $borderColor={colors.actionWarningBorder}
        $textColor={colors.actionWarningText}
        $hoverBg={colors.actionWarningHoverBg}
        $hoverText={colors.actionWarningHoverText}
      />
      {typeof onDelete === "function" && (
        <Popconfirm
          title={deleteMessage}
          okText="Eliminar"
          cancelText="Cancelar"
          onConfirm={() => onDelete(record.id)}
        >
          <DangerHoverActionButton
            shape="circle"
            icon={<DeleteOutlined />}
            title="Eliminar"
            $borderColor="#dc2626"
            $textColor="#dc2626"
            $hoverBg="#dc2626"
            $hoverText="#ffffff"
          />
        </Popconfirm>
      )}
    </Space>
  );
};

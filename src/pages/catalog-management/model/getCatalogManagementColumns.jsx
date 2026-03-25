import { EditOutlined, FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

export const getCatalogManagementColumns = ({
  actionColors,
  onOpenSuppliers,
  onAddProducts,
  onEditCatalogItem,
  CatalogStatusPill,
  SuppliersViewButton,
  CatalogActionIconButton,
  RowActions,
}) => [
  { title: "ID", dataIndex: "id", width: 80, sorter: false, align: "center" },
  { title: "FECHA", dataIndex: "date", width: 140, sorter: false, align: "center" },
  {
    title: "NOMBRE CONVOCATORIA",
    dataIndex: "name",
    width: 260,
    sorter: false,
  },
  {
    title: "PLANES PRODUCTIVOS",
    dataIndex: "plansLabel",
    width: 320,
    sorter: false,
  },
  {
    title: "ESTADO",
    dataIndex: "status",
    width: 140,
    sorter: false,
    align: "center",
    render: (_value, record) => <CatalogStatusPill item={record} />,
  },
  {
    title: "N° PROVEEDORES",
    dataIndex: "n_suppliers",
    width: 160,
    sorter: false,
    align: "center",
  },
  {
    title: "PROVEEDORES",
    dataIndex: "suppliersList",
    width: 150,
    align: "center",
    render: (_value, record) => (
      <SuppliersViewButton
        $borderColor={actionColors.actionWarningBorder}
        $textColor={actionColors.actionWarningText}
        $hoverBg={actionColors.actionWarningHoverBg}
        $hoverText={actionColors.actionWarningHoverText}
        icon={<FileTextOutlined />}
        onClick={() => onOpenSuppliers(record)}
      >
        Ver
      </SuppliersViewButton>
    ),
  },
  {
    title: "ACCIONES",
    dataIndex: "actions",
    width: 240,
    align: "center",
    render: (_value, record) => (
      <RowActions size={8}>
        <Tooltip title="Adicionar producto al catalogo">
          <CatalogActionIconButton
            icon={<PlusOutlined />}
            onClick={() => onAddProducts(record.id)}
            $borderColor={actionColors.actionBlueBg}
            $textColor={actionColors.actionBlueBg}
            $hoverBg={actionColors.actionBlueBg}
            $hoverText={actionColors.actionBlueText}
          >
            Adicionar
          </CatalogActionIconButton>
        </Tooltip>
        <Tooltip title="Editar Catalogo">
          <CatalogActionIconButton
            icon={<EditOutlined />}
            onClick={() => onEditCatalogItem(record.id)}
            $borderColor={actionColors.actionWarningBorder}
            $textColor={actionColors.actionWarningText}
            $hoverBg={actionColors.actionWarningHoverBg}
            $hoverText={actionColors.actionWarningHoverText}
          >
            Editar
          </CatalogActionIconButton>
        </Tooltip>
      </RowActions>
    ),
  },
];

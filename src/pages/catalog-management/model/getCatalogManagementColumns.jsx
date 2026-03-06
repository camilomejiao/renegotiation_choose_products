import { FileTextOutlined } from "@ant-design/icons";

export const getCatalogManagementColumns = ({
  actionColors,
  onOpenSuppliers,
  onEditCatalogItem,
  CatalogStatusPill,
  EditCatalogItemButton,
  SuppliersViewButton,
}) => [
  { title: "ID", dataIndex: "id", width: 80, sorter: true, align: "center" },
  { title: "FECHA", dataIndex: "date", width: 140, sorter: true, align: "center" },
  {
    title: "NOMBRE CONVOCATORIA",
    dataIndex: "name",
    width: 260,
    sorter: true,
  },
  {
    title: "PLANES PRODUCTIVOS",
    dataIndex: "plansLabel",
    width: 320,
    sorter: true,
  },
  {
    title: "ESTADO",
    dataIndex: "status",
    width: 140,
    sorter: true,
    align: "center",
    render: (_value, record) => <CatalogStatusPill item={record} />,
  },
  {
    title: "N° PROVEEDORES",
    dataIndex: "n_suppliers",
    width: 160,
    sorter: true,
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
    width: 130,
    align: "center",
    render: (_value, record) => (
      <EditCatalogItemButton onClick={() => onEditCatalogItem(record.id)} />
    ),
  },
];

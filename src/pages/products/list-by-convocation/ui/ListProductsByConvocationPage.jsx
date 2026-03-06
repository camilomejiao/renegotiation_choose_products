import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Input,
  Layout,
  Row,
  Space,
  Tag,
  Table,
  Typography,
} from "antd";
import {
  EditOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";

import { useThemeMode } from "../../../../shared/ui/theme/ThemeProvider";
import { themeTokens } from "../../../../shared/ui/theme/tokens";
import { Page } from "../../../../shared/ui/page";
import { Modal } from "../../../../shared/ui/modal";
import { SmartTable } from "../../../../shared/ui/smart-table";
import imgPeople from "../../../../assets/image/addProducts/people1.jpg";
import { ResponseStatusEnum } from "../../../../helpers/GlobalEnum";
import { convocationProductsServices } from "../../../../helpers/services/ConvocationProductsServices";
import { HeaderImage } from "../../../../components/layout/shared/header_image/HeaderImage";

const suppliersModalColumns = [
  {
    title: "#",
    dataIndex: "index",
    key: "index",
    width: 64,
  },
  {
    title: "Proveedor",
    dataIndex: "nombre",
    key: "nombre",
  },
  {
    title: "NIT",
    dataIndex: "nit",
    key: "nit",
    width: 180,
  },
];

const toSearchableText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map((item) => toSearchableText(item)).join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value)
      .map((item) => toSearchableText(item))
      .join(" ");
  }

  return String(value);
};

export const ListProductsByConvocationPage = () => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSuppliersModal, setShowSuppliersModal] = useState(false);
  const [suppliersForModal, setSuppliersForModal] = useState([]);
  const theme = themeTokens[mode] || themeTokens.light;
  const actionColors = theme.colors;

  const getProductsByConvocation = useCallback(async () => {
    try {
      setLoading(true);
      const { data, status } =
        await convocationProductsServices.getConvocationInformation();

      if (status === ResponseStatusEnum.OK) {
        const products = normalizeRows(data);
        setRows(products);
        setFilteredRows(products);
      }
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const normalizeRows = (payload) => {
    const sourceRows = payload?.data ?? [];

    return sourceRows.map((row) => {
      const plans = (row?.planes ?? []).map((plan) => ({
        id: plan?.id ?? null,
        name: (plan?.plan?.nombre ?? "").trim(),
      }));

      return {
        id: row?.id,
        date: row?.fcrea?.split("T")?.[0] ?? "",
        name: (row?.nombre ?? "").replace(/\r?\n/g, " ").trim(),
        status: row?.abierto ? "Abierto" : "Cerrado",
        n_suppliers: row?.cant_proveedores ?? row?.proveedores?.length ?? 0,
        suppliersList: row?.proveedores ?? [],
        plans,
      };
    });
  };

  const handleModalSuppliers = useCallback((row) => {
    setSuppliersForModal(row?.suppliersList || []);
    setShowSuppliersModal(true);
  }, []);

  const handleReport = useCallback(() => {
    navigate("/admin/report-by-convocation");
  }, [navigate]);

  const handleEditClick = useCallback((id) => {
    try {
      setLoading(true);
      navigate(`/admin/edit-products-by-convocation/${id}`);
    } catch (error) {
      console.error("Error al editar:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const columns = useMemo(() => [
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
        dataIndex: "plans",
        width: 320,
        render: (_value, record) =>
          record.plans?.length ? record.plans.map((plan) => plan.name).join(", ") : "—",
      },
      {
        title: "ESTADO",
        dataIndex: "status",
        width: 140,
        sorter: true,
        align: "center",
        render: (value) => {
          const isOpen = value === "Abierto";
          return (
            <StatusPill
              $bgColor={isOpen ? actionColors.statusOpenPillBg : actionColors.statusClosedPillBg}
              $textColor={isOpen ? actionColors.statusOpenPillText : actionColors.statusClosedPillText}
            >
              {value}
            </StatusPill>
          );
        },
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
            onClick={() => handleModalSuppliers(record)}
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
          <EditActionButton
            $bgColor={actionColors.actionBlueBg}
            $hoverBg={actionColors.actionBlueHover}
            $textColor={actionColors.actionBlueText}
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record.id)}
          >
            Editar
          </EditActionButton>
        ),
      },
    ], [actionColors, handleEditClick, handleModalSuppliers]);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = rows.filter((row) =>
      Object.values(row).some((value) =>
        toSearchableText(value).toLowerCase().includes(query)
      )
    );

    setFilteredRows(filteredData);
  };

  const closeSuppliersModal = useCallback(() => {
    setShowSuppliersModal(false);
    setSuppliersForModal([]);
  }, []);

  const handleCreateProducts = useCallback(
    () => navigate("/admin/product-upload"),
    [navigate]
  );

  const suppliersModalData = suppliersForModal.map((supplier, index) => ({
    key: supplier?.id ?? `${supplier?.nit ?? "nit"}-${index}`,
    index: index + 1,
    nombre: supplier?.nombre ?? "",
    nit: supplier?.nit ?? "",
  }));

  useEffect(() => {
    getProductsByConvocation();
  }, [getProductsByConvocation]);

  return (
    <Page contentPadding="0" minHeight="calc(100vh - 220px)">
      <HeaderSection>
        <HeaderImage
          imageHeader={imgPeople}
          titleHeader="¡Empieza a agregar tus productos!"
          bannerIcon=""
          backgroundIconColor=""
          bannerInformation=""
          backgroundInformationColor=""
        />
      </HeaderSection>

      <ContentSection>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <StyledDivider />
          </Col>

          <Col span={24}>
            <TableCard bordered>
              <Row gutter={[12, 12]} align="middle" justify="space-between">
                <Col xs={24} lg={10}>
                  <SearchInput
                    size="large"
                    placeholder="Buscar..."
                    prefix={<SearchOutlined />}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </Col>

                <Col xs={24} lg={14}>
                  <ActionsSpace>
                    <Button
                      icon={<PlusOutlined />}
                      type="primary"
                      onClick={handleCreateProducts}
                    >
                      Crear
                    </Button>

                    <Button
                      icon={<FileExcelOutlined />}
                      onClick={handleReport}
                      title="Generar reporte (Excel)"
                    >
                      Reporte
                    </Button>
                  </ActionsSpace>
                </Col>
              </Row>

              <ToolbarDivider />
            </TableCard>
          </Col>

          <Col span={24}>
            <TableViewport vertical gap={0}>
              <SmartTableCard bordered>
                <SmartTable
                  rowKey="id"
                  dataSource={filteredRows}
                  columns={columns}
                  loading={loading}
                  total={filteredRows.length}
                  reload={getProductsByConvocation}
                  download={{
                    enable: true,
                    fileName: "convocatorias",
                  }}
                  showPagination
                  pageSizeOptions={["10", "20", "50", "100"]}
                  defaultPageSize="10"
                  enableRowSelection={false}
                  showToolbar
                  showTableResize={false}
                  showColumnSettings={false}
                  dangerRowCondition={(record) => record?.status === "Cerrado"}
                  successRowCondition={(record) => record?.status === "Abierto"}
                  scroll={{ x: "max-content" }}
                />
              </SmartTableCard>
            </TableViewport>
          </Col>
        </Row>
      </ContentSection>

      <Modal
        isOpen={showSuppliersModal}
        onCloseModal={closeSuppliersModal}
        centered
        width="min(92vw, 720px)"
        maxBodyHeight="65vh"
        footer={<Button onClick={closeSuppliersModal}>Cerrar</Button>}
        title={<ModalTitle level={5}>Proveedores</ModalTitle>}
      >
        <Table
          columns={suppliersModalColumns}
          dataSource={suppliersModalData}
          pagination={false}
          locale={{ emptyText: "No hay proveedores registrados." }}
          size="small"
          scroll={{ x: 520 }}
        />
      </Modal>
    </Page>
  );
};

const ContentSection = styled(Layout.Content)`
  position: relative;
  z-index: 1;
  padding: 12px 12px 24px;

  @media (min-width: 992px) {
    padding: 12px 24px 32px;
  }
`;

const HeaderSection = styled.section`
  position: relative;
  z-index: 2;
`;

const StyledDivider = styled(Divider)`
  margin: 0;
`;

const ToolbarDivider = styled(Divider)`
  margin: 12px 0 16px;
`;

const SearchInput = styled(Input)`
  width: 100%;
`;

const ActionsSpace = styled(Space)`
  width: 100%;
  justify-content: flex-start;

  @media (min-width: 992px) {
    justify-content: flex-end;
  }
`;

const TableViewport = styled(Flex)`
  width: 100%;
  min-height: 360px;
`;

const TableCard = styled(Card)`
  width: 100%;
  border-radius: 12px;
`;

const SmartTableCard = styled(TableCard)`
  height: auto;
`;

const ModalTitle = styled(Typography.Title)`
  && {
    margin: 0;
  }
`;

const SuppliersViewButton = styled(Button, {
  shouldForwardProp: (prop) =>
    !["$borderColor", "$textColor", "$hoverBg", "$hoverText"].includes(prop),
})`
  border-color: ${({ $borderColor }) => $borderColor};
  background: transparent;
  color: ${({ $textColor }) => $textColor};

  &:hover,
  &:focus {
    border-color: ${({ $hoverBg }) => $hoverBg} !important;
    background: ${({ $hoverBg }) => $hoverBg} !important;
    color: ${({ $hoverText }) => $hoverText} !important;
  }
`;

const EditActionButton = styled(Button, {
  shouldForwardProp: (prop) => !["$bgColor", "$hoverBg", "$textColor"].includes(prop),
})`
  border-color: ${({ $bgColor }) => $bgColor};
  background: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};

  &:hover,
  &:focus {
    border-color: ${({ $hoverBg }) => $hoverBg} !important;
    background: ${({ $hoverBg }) => $hoverBg} !important;
    color: ${({ $textColor }) => $textColor} !important;
  }
`;

const StatusPill = styled(Tag, {
  shouldForwardProp: (prop) => !["$bgColor", "$textColor"].includes(prop),
})`
  && {
    margin-inline-end: 0;
    border: none;
    border-radius: 999px;
    padding: 2px 10px;
    font-weight: 600;
    background: ${({ $bgColor }) => $bgColor};
    color: ${({ $textColor }) => $textColor};
  }
`;

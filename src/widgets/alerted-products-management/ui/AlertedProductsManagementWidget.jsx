import {
  ActionsRow,
  ManagementCard,
  ManagementDescription,
  ManagementHeader,
  ManagementSection,
  ManagementSummary,
  ManagementTitle,
  PrimaryActionButton,
  ProductMeta,
  ProductListItem,
  ProductRow,
  ProductsList,
  ProductTitle,
  SecondaryActionButton,
  SectionTitle,
  SummaryTag,
} from "./AlertedProductsManagementWidget.styles";

export const AlertedProductsManagementWidget = ({
  assignment,
  onBack,
  onContinue,
}) => {
  const selectedRows = assignment?.selectedRows || [];

  return (
    <ManagementCard bordered={false}>
      <ManagementHeader>
        <ManagementTitle>Gestión de alerta</ManagementTitle>
        <ManagementDescription>
          Este módulo recibe la selección confirmada en preparación y queda listo
          para conectar formularios, responsables, observaciones y persistencia.
        </ManagementDescription>
      </ManagementHeader>

      <ManagementSummary>
        <SummaryTag color="blue">{selectedRows.length} productos</SummaryTag>
        <SummaryTag color="processing">
          {assignment?.managementType || "Sin tipo de gestión"}
        </SummaryTag>
      </ManagementSummary>

      <ManagementSection>
        <SectionTitle>Productos incluidos en la gestión</SectionTitle>
        <ProductsList
          dataSource={selectedRows}
          renderItem={(item) => (
            <ProductListItem>
              <ProductRow>
                <ProductTitle>{item.productName}</ProductTitle>
                <ProductMeta>
                  {item.productId} · {item.supplier}
                </ProductMeta>
              </ProductRow>
            </ProductListItem>
          )}
        />
      </ManagementSection>

      <ActionsRow>
        <SecondaryActionButton onClick={onBack}>
          Volver a preparación
        </SecondaryActionButton>
        <PrimaryActionButton type="primary" onClick={onContinue}>
          Continuar a centralización
        </PrimaryActionButton>
      </ActionsRow>
    </ManagementCard>
  );
};

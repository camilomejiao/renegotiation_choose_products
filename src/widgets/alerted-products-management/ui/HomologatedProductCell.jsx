import { SwapOutlined } from "@ant-design/icons";

import { formatCurrency } from "../lib/format";
import {
  HomologateButton,
  HomologationEmptyText,
  HomologationLinkButton,
  HomologationNameBox,
  HomologationSummary,
  HomologationSummaryActions,
  HomologationSummaryMeta,
  HomologationSummaryPrimary,
} from "./HomologatedProductCell.styles";

export const HomologatedProductCell = ({ product, touched, onAssign, onRemove }) => {
  if (!product) {
    return (
      <div>
        <HomologateButton icon={<SwapOutlined />} onClick={onAssign}>
          Homologar por
        </HomologateButton>
        <HomologationEmptyText $error={touched}>
          {touched
            ? "Debes asignar un producto homologado."
            : "Sin producto homologado asignado."}
        </HomologationEmptyText>
      </div>
    );
  }

  return (
    <HomologationSummary>
      <HomologationNameBox>
        {product.productId ? `${product.productId} - ` : ""}
        {product.productName || "—"}
      </HomologationNameBox>
      <HomologationSummaryPrimary>
        {product.unitOfMeasure || "—"} · {product.commercialBrand || "—"}
      </HomologationSummaryPrimary>
      <HomologationSummaryMeta>
        Rango: {formatCurrency(product.minimumPrice)} a{" "}
        {formatCurrency(product.maximumPrice)} · Venta:{" "}
        {formatCurrency(product.saleUnitValue)} · Catálogo:{" "}
        {formatCurrency(product.fairCatalogValue)}
      </HomologationSummaryMeta>
      <HomologationSummaryActions>
        <HomologationLinkButton type="button" onClick={onAssign}>
          Cambiar
        </HomologationLinkButton>
        <HomologationLinkButton type="button" $variant="danger" onClick={onRemove}>
          Quitar
        </HomologationLinkButton>
      </HomologationSummaryActions>
    </HomologationSummary>
  );
};
import styled from "@emotion/styled";
import { Card, Divider } from "antd";

export const HeaderSection = styled.div`
  position: relative;
  z-index: 2;
`;

export const ContentSection = styled.div`
  position: relative;
  z-index: 1;
  padding: 12px 12px 24px;

  @media (min-width: 992px) {
    padding: 12px 24px 32px;
  }
`;

export const StyledDivider = styled(Divider)`
  margin: 0;
`;

export const AlertedProductsPageWrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 24,
});

export const AlertedProductsContentGrid = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(280px, 320px) minmax(0, 1fr)",
  gap: 18,
  alignItems: "start",
  "@media (max-width: 1024px)": {
    gridTemplateColumns: "1fr",
  },
});

export const AlertedProductsSidebar = styled.aside({
  minWidth: 0,
  display: "grid",
  gap: 18,
});

export const AlertedProductsMainContent = styled.section({
  minWidth: 0,
  display: "grid",
  gap: 18,
});

export const AlertedProductsStepperCard = styled(Card)({
  borderRadius: 20,
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 247, 252, 0.96) 100%)",
  border: "1px solid rgba(21, 40, 84, 0.08)",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
  padding: "10px 4px",
});

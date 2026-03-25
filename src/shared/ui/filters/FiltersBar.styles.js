import styled from "@emotion/styled";

export const FiltersBarWrapper = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 12,
  marginBottom: 12,
});

export const FiltersGroup = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  alignItems: "center",
});

export const FiltersInput = styled.input(({ theme }) => ({
  minWidth: 220,
  padding: "10px 12px",
  borderRadius: 8,
  border: `1px solid ${theme.colors.borderLight}`,
  outline: "none",
}));

export const FiltersActions = styled.div({
  display: "flex",
  gap: 12,
  alignItems: "center",
});

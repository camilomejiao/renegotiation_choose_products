import styled from "@emotion/styled";

export const HeaderShell = styled.header(({ isSidebarOpen, isMobile, withSidebar, theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "var(--header-h)",
  zIndex: 1100,
  background: theme.colors.headerGradient,
  color: theme.colors.textOnDark,
  paddingLeft: isMobile
    ? 24
    : withSidebar
    ? `calc(${isSidebarOpen ? "var(--sidebar-w)" : "var(--sidebar-w-collapsed)"} + 24px)`
    : 24,
  paddingRight: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: theme.colors.shadowMd,
}));

export const HeaderLeft = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 64,
});

export const HeaderCenter = styled.div({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
});

export const HeaderRight = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 8,
  minWidth: 160,
  justifyContent: "flex-end",
});

export const HeaderBrand = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  color: "#ffffff",
});

export const HeaderBrandAccent = styled.span(({ theme }) => ({
  color: theme.colors.success,
}));

export const MenuToggle = styled.button(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  border: "1px solid rgba(255, 255, 255, 0.35)",
  borderRadius: 10,
  background: "rgba(255, 255, 255, 0.16)",
  color: theme.colors.textOnDark,
  cursor: "pointer",
}));

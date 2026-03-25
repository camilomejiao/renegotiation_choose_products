import styled from "@emotion/styled";

export const SidebarShell = styled.div(({ isOpen, isMobile, theme }) => ({
  background: theme.colors.sidebarGradient,
  color: theme.colors.textOnDark,
  width: isMobile ? "min(85vw, 280px)" : isOpen ? "var(--sidebar-w)" : "var(--sidebar-w-collapsed)",
  height: "100vh",
  position: "fixed",
  left: 0,
  top: 0,
  overflowY: "auto",
  boxShadow: "4px 0 6px -1px rgb(0 0 0 / 0.1)",
  display: "flex",
  flexDirection: "column",
  transition: "width 0.3s ease, transform 0.3s ease",
  transform: isMobile ? (isOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
  zIndex: 1200,
  paddingTop: "var(--header-h)",
}));

export const SidebarBrand = styled.div(({ isOpen, isMobile, theme }) => ({
  position: isMobile ? "static" : "fixed",
  top: 0,
  left: 0,
  height: isMobile ? "auto" : "var(--header-h)",
  width: isMobile ? "100%" : isOpen ? "var(--sidebar-w)" : "var(--sidebar-w-collapsed)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: isMobile ? "14px 20px" : "0",
  fontSize: isMobile ? 14 : 16,
  fontWeight: 700,
  letterSpacing: 0.5,
  textTransform: "uppercase",
  background: isMobile ? "transparent" : theme.colors.headerGradient,
  borderBottom: `1px solid ${theme.colors.borderLight}`,
  zIndex: 1300,
  boxSizing: "border-box",
  textAlign: "center",
  color: theme.colors.textOnDark,
  textShadow: "0 1px 2px rgba(15, 23, 42, 0.4)",
  pointerEvents: "none",
}));

export const NavItem = styled.div({
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
});

export const NavLink = styled.button(({ theme }) => ({
  color: theme.colors.textMutedOnDark,
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  gap: 12,
  textDecoration: "none",
  transition: "all 0.2s ease",
  fontWeight: 500,
  background: "none",
  border: "none",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "inherit",
  ":focus-visible": {
    outline: `2px solid ${theme.colors.focusRing}`,
    outlineOffset: "-2px",
  },
  ":hover": {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    color: theme.colors.textOnDark,
    borderRight: `4px solid ${theme.colors.primaryHover}`,
  },
  "&.active": {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    color: theme.colors.textOnDark,
    borderRight: `4px solid ${theme.colors.primaryHover}`,
  },
  "&[data-static=\"true\"]": {
    cursor: "default",
  },
  "&[data-static=\"true\"]:hover": {
    backgroundColor: "transparent",
    borderRight: "none",
    color: theme.colors.textMutedOnDark,
  },
  svg: {
    fontSize: 18,
    color: theme.colors.textOnDark,
  },
  ".sidebar-icon": {
    fontSize: 18,
    color: theme.colors.textOnDark,
  },
}));

export const MobileHeader = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 20px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
});

export const MobileClose = styled.button(({ theme }) => ({
  background: "transparent",
  border: "none",
  color: theme.colors.textOnDark,
  fontSize: 20,
  lineHeight: 1,
  padding: 0,
  cursor: "pointer",
}));

export const SidebarToggleRow = styled.div({
  marginTop: "auto",
  display: "flex",
  justifyContent: "center",
  padding: "14px 0 20px",
});

export const SidebarToggleBtn = styled(NavLink)({
  justifyContent: "center",
  gap: 10,
});

export const BrandText = styled.span({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  gap: 6,
  color: "inherit",
});

export const BrandAccent = styled.span(({ theme }) => ({
  color: theme.colors.success,
}));

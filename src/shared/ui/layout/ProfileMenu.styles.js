import styled from "@emotion/styled";

export const ProfileWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 8,
  minWidth: 160,
  justifyContent: "flex-end",
});

export const UserMenuTrigger = styled.button({
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "transparent",
  border: "none",
  color: "inherit",
  cursor: "pointer",
  font: "inherit",
  padding: "6px 8px",
  borderRadius: 8,
  svg: {
    fontSize: 20,
  },
  ":hover, :focus-visible": {
    background: "rgba(255, 255, 255, 0.16)",
    outline: "none",
  },
});

export const UserName = styled.span({
  maxWidth: 160,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const UserMenu = styled.div({
  position: "absolute",
  top: "100%",
  right: 0,
  marginTop: 8,
  background: "#ffffff",
  color: "#0f172a",
  borderRadius: 10,
  boxShadow: "0 10px 20px rgba(15, 23, 42, 0.18)",
  padding: 6,
  minWidth: 180,
  zIndex: 1300,
});

export const UserMenuItem = styled.button({
  width: "100%",
  textAlign: "left",
  background: "transparent",
  border: "none",
  padding: "10px 12px",
  borderRadius: 8,
  color: "#0f172a",
  fontWeight: 600,
  cursor: "pointer",
  ":hover, :focus-visible": {
    background: "#e2e8f0",
    outline: "none",
  },
});

export const UserMenuRow = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "10px 12px",
  borderRadius: 8,
});

export const UserMenuLabel = styled.span({
  fontWeight: 600,
});

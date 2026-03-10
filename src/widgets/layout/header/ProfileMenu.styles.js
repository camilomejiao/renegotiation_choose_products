import styled from "@emotion/styled";
import { Avatar } from "antd";

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
  gap: 10,
  background: "transparent",
  border: "1px solid rgba(255, 255, 255, 0.16)",
  color: "inherit",
  cursor: "pointer",
  font: "inherit",
  padding: "6px 10px",
  borderRadius: 999,
  ":hover, :focus-visible": {
    background: "rgba(255, 255, 255, 0.16)",
    outline: "none",
  },
});

export const UserTriggerAvatar = styled(Avatar)({
  backgroundColor: "#fde3cf",
  color: "#f56a00",
  flexShrink: 0,
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
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  boxShadow: "0 16px 36px rgba(15, 23, 42, 0.18)",
  padding: 8,
  minWidth: 260,
  zIndex: 1300,
});

export const MenuHeader = styled.div({
  display: "grid",
  justifyItems: "center",
  gap: 8,
  padding: "12px 12px 16px",
});

export const MenuHeaderAvatar = styled(Avatar)({
  backgroundColor: "#fde3cf",
  color: "#f56a00",
  boxShadow: "0 10px 24px rgba(245, 106, 0, 0.18)",
});

export const MenuHeaderName = styled.span({
  fontWeight: 700,
  fontSize: 15,
  color: "#0f172a",
  textAlign: "center",
  wordBreak: "break-word",
});

export const MenuDivider = styled.div({
  height: 1,
  background: "#e2e8f0",
  margin: "2px 0",
});

export const UserMenuAction = styled.button({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "transparent",
  border: "none",
  padding: "12px 12px",
  borderRadius: 12,
  color: "#0f172a",
  fontWeight: 600,
  cursor: "pointer",
  ":hover, :focus-visible": {
    background: "#f8fafc",
    outline: "none",
  },
});

export const MenuActionContent = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 12,
});

export const MenuActionIcon = styled.span({
  width: 28,
  height: 28,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#1d4ed8",
  flexShrink: 0,
});

export const UserMenuRow = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 12px",
  borderRadius: 12,
  ":hover": {
    background: "#f8fafc",
  },
});

export const UserMenuLabel = styled.span({
  fontWeight: 600,
});

import React, { useEffect, useRef, useState } from "react";
import {
  LogoutOutlined,
  MoonOutlined,
  ProfileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AppSwitch } from "../../../shared/ui/switch";
import { useThemeMode } from "../../../shared/ui/theme/ThemeProvider";
import {
  MenuActionContent,
  MenuActionIcon,
  MenuDivider,
  MenuHeader,
  MenuHeaderAvatar,
  MenuHeaderName,
  ProfileWrapper,
  UserMenuAction,
  UserMenuTrigger,
  UserTriggerAvatar,
  UserName,
  UserMenu,
  UserMenuLabel,
  UserMenuRow,
} from "./ProfileMenu.styles";

export const ProfileMenu = ({
  displayName = "test user",
  onLogout,
  onEditProfile,
  onEditAnyUser,
  showUserMenu,
}) => {
  const { mode, toggleMode } = useThemeMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const shouldShowUserMenu = Boolean(showUserMenu);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const menuItems = [
    { id: "profile", label: "Mi perfil", onClick: onEditProfile },
    { id: "edit-user", label: "Editar un usuario", onClick: onEditAnyUser },
    { id: "logout", label: "Cerrar sesión", onClick: onLogout },
  ].filter((item) => item.onClick);

  if (!shouldShowUserMenu) {
    return null;
  }

  return (
    <ProfileWrapper ref={menuRef}>
      <UserMenuTrigger
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
      >
        <UserTriggerAvatar size="small" icon={<UserOutlined />} aria-hidden="true" />
        <UserName>{displayName}</UserName>
      </UserMenuTrigger>
      {isMenuOpen && (
        <UserMenu role="menu">
          <MenuHeader>
            <MenuHeaderAvatar size={52} icon={<UserOutlined />} />
            <MenuHeaderName>{displayName}</MenuHeaderName>
          </MenuHeader>

          <MenuDivider />

          <UserMenuRow>
            <MenuActionContent>
              <MenuActionIcon aria-hidden="true">
                <MoonOutlined />
              </MenuActionIcon>
              <UserMenuLabel>Modo oscuro</UserMenuLabel>
            </MenuActionContent>
            <AppSwitch
              size="small"
              checked={mode === "dark"}
              onChange={toggleMode}
            />
          </UserMenuRow>

          <MenuDivider />

          {menuItems.map((item) => (
            <UserMenuAction
              key={item.id}
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                item.onClick();
              }}
              role="menuitem"
            >
              <MenuActionContent>
                <MenuActionIcon aria-hidden="true">
                  {item.id === "profile" && <ProfileOutlined />}
                  {item.id === "edit-user" && <TeamOutlined />}
                  {item.id === "logout" && <LogoutOutlined />}
                </MenuActionIcon>
                <span>{item.label}</span>
              </MenuActionContent>
            </UserMenuAction>
          ))}
        </UserMenu>
      )}
    </ProfileWrapper>
  );
};

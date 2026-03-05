import React, { useEffect, useRef, useState } from "react";
import { Switch } from "antd";
import { FaUserCircle } from "react-icons/fa";
import { useThemeMode } from "../../../shared/ui/theme/ThemeProvider";
import {
  ProfileWrapper,
  UserMenuTrigger,
  UserName,
  UserMenu,
  UserMenuItem,
  UserMenuLabel,
  UserMenuRow,
} from "./ProfileMenu.styles";

export const ProfileMenu = ({
  displayName = "test user",
  onLogout,
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
        <FaUserCircle aria-hidden="true" />
        <UserName>{displayName}</UserName>
      </UserMenuTrigger>
      {isMenuOpen && (
        <UserMenu role="menu">
          <UserMenuRow>
            <UserMenuLabel>Modo oscuro</UserMenuLabel>
            <Switch
              size="small"
              checked={mode === "dark"}
              onChange={toggleMode}
            />
          </UserMenuRow>
          {menuItems.map((item) => (
            <UserMenuItem
              key={item.id}
              type="button"
              onClick={item.onClick}
              role="menuitem"
            >
              {item.label}
            </UserMenuItem>
          ))}
        </UserMenu>
      )}
    </ProfileWrapper>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { Switch } from "antd";
import { FaBars, FaUserCircle } from "react-icons/fa";
import logo1 from "../../../assets/image/header/logo-DSCI.png";
import { useThemeMode } from "../theme/ThemeProvider";
import {
  HeaderShell,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
  MenuToggle,
  UserMenuTrigger,
  UserName,
  UserMenu,
  UserMenuItem,
  UserMenuLabel,
  UserMenuRow,
} from "./Header.styles";

export const Header = ({
  isMobile = false,
  isSidebarOpen = false,
  onMenuToggle,
  userAuth,
  onLogout,
  showUserMenu,
  withSidebar = true,
}) => {
  const { mode, toggleMode } = useThemeMode();
  const displayName =
    userAuth?.username && String(userAuth.username).trim()
      ? String(userAuth.username).trim()
      : "test user";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const shouldShowUserMenu = showUserMenu ?? Boolean(onLogout);

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

  return (
    <HeaderShell isSidebarOpen={isSidebarOpen} isMobile={isMobile} withSidebar={withSidebar}>
      <HeaderLeft>
        {onMenuToggle && isMobile && (
          <MenuToggle
            type="button"
            onClick={onMenuToggle}
            aria-label={isSidebarOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={isSidebarOpen}
          >
            <FaBars />
          </MenuToggle>
        )}
      </HeaderLeft>
      <HeaderCenter>
        <img
          src={logo1}
          alt="Agencia de Renovacion del Territorio"
          style={{
            height: isMobile ? "40px" : "50px",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
          }}
        />
      </HeaderCenter>
      <HeaderRight ref={menuRef}>
        {shouldShowUserMenu && (
          <>
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
          </>
        )}
      </HeaderRight>
    </HeaderShell>
  );
};

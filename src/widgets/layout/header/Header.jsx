import React from "react";
import {FaBars} from "react-icons/fa";
import logo1 from "../../../assets/image/header/logo-DSCI.png";
import {ProfileMenu} from "./ProfileMenu";
import {
    HeaderShell,
    HeaderLeft,
    HeaderCenter,
    HeaderRight,
    HeaderBrand,
    HeaderBrandAccent,
    MenuToggle,
} from "./Header.styles";

export const Header = ({
                           isMobile = false,
                           isSidebarOpen = false,
                           onMenuToggle,
                           userAuth,
                           userRoleLabel,
                           onLogout,
                           onEditProfile,
                           onEditAnyUser,
                           showUserMenu,
                           withSidebar,
                           showBrand,
                           logoOnRight,
                       }) => {
    const hasSidebar = Boolean(withSidebar);
    const shouldShowBrand = Boolean(showBrand);
    const shouldShowUserMenu = Boolean(showUserMenu);
    const shouldShowLogoOnRight = Boolean(logoOnRight);
    const displayName =
        userAuth?.username && String(userAuth.username).trim()
            ? String(userAuth.username).trim()
            : "test user";

    return (
        <HeaderShell isSidebarOpen={isSidebarOpen} isMobile={isMobile} withSidebar={hasSidebar}>
            <HeaderLeft>
                {onMenuToggle && isMobile && (
                    <MenuToggle
                        type="button"
                        onClick={onMenuToggle}
                        aria-label={isSidebarOpen ? "Cerrar menu" : "Abrir menu"}
                        aria-expanded={isSidebarOpen}
                    >
                        <FaBars/>
                    </MenuToggle>
                )}
                {shouldShowBrand && (
                    <HeaderBrand>
                        <span>Portal</span>
                        <HeaderBrandAccent>PNIS</HeaderBrandAccent>
                    </HeaderBrand>
                )}
            </HeaderLeft>
            {!shouldShowLogoOnRight && (
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
            )}
            <HeaderRight>
                {shouldShowLogoOnRight && (
                    <img
                        src={logo1}
                        alt="Agencia de Renovacion del Territorio"
                        style={{
                            height: isMobile ? "40px" : "50px",
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                        }}
                    />
                )}
                <ProfileMenu
                    displayName={displayName}
                    roleLabel={userRoleLabel}
                    onLogout={onLogout}
                    onEditProfile={onEditProfile}
                    onEditAnyUser={onEditAnyUser}
                    showUserMenu={shouldShowUserMenu}
                />
            </HeaderRight>
        </HeaderShell>
    );
};

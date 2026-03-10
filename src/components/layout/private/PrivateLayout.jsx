import useAuth from "../../../hooks/useAuth";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "../../../widgets/layout/sidebar";
import { Header } from "../../../widgets/layout/header";
import { Footer } from "../../../widgets/layout/footer";
import { AppShell } from "../../../widgets/layout/app-shell";
import { Loading } from "../shared/loading/Loading";
import { resolvePrivateLayoutRoute } from "./config/layoutRoutes";
import { RolesEnum } from "../../../helpers/GlobalEnum";
import { getRoleTitle } from "../../../entities/user/model/getRoleTitle";
import {
    hasForcedPasswordChange,
    hasPasswordValidityWarning,
} from "../../../shared/auth/lib/authSession";
import { PasswordValidityNoticeModal } from "../shared/Modals/PasswordValidityNoticeModal";

const MOBILE_BREAKPOINT = 992;
const LoadingIndicator = () => <Loading fullScreen text="Cargando..." />;
const PROFILE_ROUTE = "/admin/edit-user";
const LOGOUT_ROUTE = "/admin/logout";

export const PrivateLayout = () => {
    const { auth, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isPasswordValidityModalOpen, setIsPasswordValidityModalOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleUnauthorizedAccess = () => {
        logout();
        return <Navigate to="/login" replace />;
    };

    const isSidebarOpen = isMobile ? isMobileSidebarOpen : isDesktopSidebarOpen;

    const handleSidebarToggle = (nextOpen) => {
        if (isMobile) {
            setIsMobileSidebarOpen(nextOpen);
            return;
        }
        setIsDesktopSidebarOpen(nextOpen);
    };

    const handleMobileMenuToggle = () => {
        setIsMobileSidebarOpen((prev) => !prev);
    };

    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    const handleLogout = () => {
        navigate("/admin/logout");
    };

    const handleEditProfile = () => {
        navigate("/admin/edit-user");
    };

    const handleGoToProfileFromModal = () => {
        setIsPasswordValidityModalOpen(false);
        navigate(PROFILE_ROUTE);
    };

    const handleEditAnyUser = () => {
        navigate("/admin/management");
    };

    const routeLayout = resolvePrivateLayoutRoute(location.pathname);
    const contentMode = routeLayout?.contentMode || "legacy";
    const mustChangePassword = hasForcedPasswordChange(auth);
    const shouldWarnPasswordValidity =
        !mustChangePassword && hasPasswordValidityWarning(auth);
    const isAllowedForcedPasswordPath =
        location.pathname === PROFILE_ROUTE || location.pathname === LOGOUT_ROUTE;

    useEffect(() => {
        const shouldOpenModal =
            shouldWarnPasswordValidity &&
            location.state?.showPasswordValidityNotice === true;

        if (!shouldOpenModal) {
            return;
        }

        setIsPasswordValidityModalOpen(true);
        navigate(`${location.pathname}${location.search}`, { replace: true });
    }, [
        location.pathname,
        location.search,
        location.state,
        navigate,
        shouldWarnPasswordValidity,
    ]);

    const headerProps = {
        isMobile,
        isSidebarOpen,
        onMenuToggle: handleMobileMenuToggle,
        userAuth: auth,
        userRoleLabel: getRoleTitle(auth?.rol_id),
        onLogout: handleLogout,
        onEditProfile: handleEditProfile,
        onEditAnyUser:
            auth?.rol_id === RolesEnum.ADMIN && !mustChangePassword
                ? handleEditAnyUser
                : undefined,
        showUserMenu: true,
        withSidebar: true,
    };

    const headerNode =
        typeof routeLayout?.renderHeader === "function"
            ? routeLayout.renderHeader(headerProps)
            : <Header {...headerProps} />;

    const footerNode =
        typeof routeLayout?.renderFooter === "function"
            ? routeLayout.renderFooter({ userAuth: auth, isMobile })
            : <Footer />;

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!auth?.id) {
        return handleUnauthorizedAccess();
    }

    if (mustChangePassword && !isAllowedForcedPasswordPath) {
        return <Navigate to={PROFILE_ROUTE} replace state={{ from: location.pathname }} />;
    }

    return (
        <AppShell
            isDesktopSidebarOpen={isDesktopSidebarOpen}
            isMobile={isMobile}
            isMobileSidebarOpen={isMobileSidebarOpen}
            onCloseMobile={closeMobileSidebar}
            contentMode={contentMode}
            header={headerNode}
            sidebar={(
                <Sidebar
                    userAuth={auth}
                    isOpen={isSidebarOpen}
                    isMobile={isMobile}
                    onToggle={handleSidebarToggle}
                    onCloseMobile={closeMobileSidebar}
                />
            )}
            footer={footerNode}
        >
            <Outlet context={{ userAuth: auth }} />
            <PasswordValidityNoticeModal
                open={isPasswordValidityModalOpen}
                daysRemaining={auth?.password_validity}
                onClose={() => setIsPasswordValidityModalOpen(false)}
                onGoToProfile={handleGoToProfileFromModal}
            />
        </AppShell>
    );
};

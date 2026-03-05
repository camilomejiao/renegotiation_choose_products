import useAuth from "../../../hooks/useAuth";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "../../../widgets/layout/sidebar";
import { Header } from "../../../widgets/layout/header";
import { Footer } from "../../../widgets/layout/footer";
import { AppShell } from "../../../widgets/layout/app-shell";
import { Loading } from "../shared/loading/Loading";

const MOBILE_BREAKPOINT = 992;
const LoadingIndicator = () => <Loading fullScreen text="Cargando..." />;

export const PrivateLayout = () => {
    const { auth, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

    const disablePageWrapper = location.pathname === "/admin/list-products-by-convocation";

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!auth?.id) {
        return handleUnauthorizedAccess();
    }

    return (
        <AppShell
            isDesktopSidebarOpen={isDesktopSidebarOpen}
            isMobile={isMobile}
            isMobileSidebarOpen={isMobileSidebarOpen}
            onCloseMobile={closeMobileSidebar}
            disablePageWrapper={disablePageWrapper}
            header={(
                <Header
                    isMobile={isMobile}
                    isSidebarOpen={isSidebarOpen}
                    onMenuToggle={handleMobileMenuToggle}
                    userAuth={auth}
                    onLogout={handleLogout}
                    showUserMenu
                    withSidebar
                />
            )}
            sidebar={(
                <Sidebar
                    userAuth={auth}
                    isOpen={isSidebarOpen}
                    isMobile={isMobile}
                    onToggle={handleSidebarToggle}
                    onCloseMobile={closeMobileSidebar}
                />
            )}
            footer={<Footer />}
        >
            <Outlet context={{ userAuth: auth }} />
        </AppShell>
    );
};

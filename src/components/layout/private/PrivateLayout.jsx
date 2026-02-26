import useAuth from "../../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "../shared/sidebar/Sidebar";
import { Header } from "../shared/header/Header";
import { Footer } from "../shared/footer/Footer";
import { AppShell } from "../../../shared/ui/layout/AppShell";
import { Loading } from "../shared/loading/Loading";

const MOBILE_BREAKPOINT = 992;
const LoadingIndicator = () => <Loading fullScreen text="Cargando..." />;

export const PrivateLayout = () => {
    const { auth, loading, logout } = useAuth();
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
        logout(); // Limpiar datos residuales
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

    // Mostrar un indicador de carga mientras se obtiene la autenticaci�n
    if (loading) {
        return <LoadingIndicator />;
    }

    //Si no est� autenticado, redirigir al login
    if (!auth?.id) {
        return handleUnauthorizedAccess();
    }

    // Renderizar el layout privado si el usuario est� autenticado
    return (
        <AppShell
            isDesktopSidebarOpen={isDesktopSidebarOpen}
            isMobile={isMobile}
            isMobileSidebarOpen={isMobileSidebarOpen}
            onCloseMobile={closeMobileSidebar}
            header={(
                <Header
                    isMobile={isMobile}
                    isSidebarOpen={isSidebarOpen}
                    onMenuToggle={handleMobileMenuToggle}
                    userAuth={auth}
                    onLogout={logout}
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

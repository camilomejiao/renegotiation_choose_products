import useAuth from "../../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "../shared/sidebar/Sidebar";
import { Header } from "../shared/header/Header";
import { Footer } from "../shared/footer/Footer";
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

    // Mostrar un indicador de carga mientras se obtiene la autenticación
    if (loading) {
        return <LoadingIndicator />;
    }

    //Si no está autenticado, redirigir al login
    if (!auth?.id) {
        return handleUnauthorizedAccess();
    }

    // Renderizar el layout privado si el usuario está autenticado
    return (
        <div className={`app ${isDesktopSidebarOpen ? "sidebar-open" : "sidebar-collapsed"} ${isMobile ? "is-mobile" : ""}`}>
            <Header
                isMobile={isMobile}
                isSidebarOpen={isSidebarOpen}
                onMenuToggle={handleMobileMenuToggle}
            />
            {isMobile && isMobileSidebarOpen && (
                <button
                    type="button"
                    aria-label="Cerrar menu lateral"
                    className="sidebar-overlay"
                    onClick={closeMobileSidebar}
                />
            )}
            <div className="layout-container">
                <Sidebar
                    userAuth={auth}
                    isOpen={isSidebarOpen}
                    isMobile={isMobile}
                    onToggle={handleSidebarToggle}
                    onCloseMobile={closeMobileSidebar}
                />
                <main className={`content ${isDesktopSidebarOpen ? "" : "sidebar-collapsed"}`}>
                    <div className="page-wrapper">
                        <Outlet context={{ userAuth: auth }} />
                    </div>

                    <Footer />
                </main>
            </div>
        </div>
    );
};

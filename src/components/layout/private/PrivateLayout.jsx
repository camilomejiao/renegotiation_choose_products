import useAuth from "../../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "../shared/sidebar/Sidebar";
import { Header } from "../shared/header/Header";
import { Footer } from "../shared/footer/Footer";
import { Loading } from "../shared/loading/Loading";


const LoadingIndicator = () => <Loading fullScreen text="Cargando..." />;

export const PrivateLayout = () => {
    const { auth, loading, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleUnauthorizedAccess = () => {
        logout(); // Limpiar datos residuales
        return <Navigate to="/login" replace />;
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
        <div className={`app ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
            <Header />
            <div className="layout-container">
                <Sidebar userAuth={auth} onToggle={setIsSidebarOpen} />
                <main className={`content ${isSidebarOpen ? "" : "sidebar-collapsed"}`}>
                    <div className="page-wrapper">
                        <Outlet context={{ userAuth: auth }} />
                    </div>

                    <Footer />
                </main>
            </div>
        </div>
    );
}


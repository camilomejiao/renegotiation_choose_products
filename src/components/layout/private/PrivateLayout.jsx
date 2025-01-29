import useAuth from "../../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "../shared/sidebar/Sidebar";
import { Header } from "../shared/header/Header";
import { Footer } from "../shared/footer/Footer";


const LoadingIndicator = () => <div>Cargando...</div>;

export const PrivateLayout = () => {
    const { auth, loading, logout } = useAuth();

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
        <div className="app">
            <Header />
            <div className="layout-container">
                <Sidebar userAuth={auth} />
                <main className="content">
                    <Outlet context={{ userAuth: auth }} />

                    <Footer />
                </main>
            </div>
        </div>
    );
}
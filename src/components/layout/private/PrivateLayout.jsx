import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Footer } from "../shared/footer/Footer";
import { Header } from "../shared/header/Header";
import { Sidebar } from "../shared/sidebar/Sidebar";

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
    <div className="app-shell">
      <Header />
      <div className="app-layout">
        <Sidebar userAuth={auth} />
        <main className="app-content">
          <div className="app-content__inner">
            <Outlet context={{ userAuth: auth }} />
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

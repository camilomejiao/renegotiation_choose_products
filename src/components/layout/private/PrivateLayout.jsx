import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Footer } from "../shared/footer/Footer";
import { Header } from "../shared/header/Header";
import { Sidebar } from "../shared/sidebar/Sidebar";
import { useState } from "react";

const LoadingIndicator = () => (
  <div className="overlay">
    <div className="loader">
      <div className="spinner-border"></div>
      <div className="spinner-text">Cargando...</div>
    </div>
  </div>
);

export const PrivateLayout = () => {
  const { auth, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleUnauthorizedAccess = () => {
    logout();
    return <Navigate to="/login" replace />;
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!auth?.id) {
    return handleUnauthorizedAccess();
  }

  return (
    <div className="app">
      <Header />
      <div className="layout-container d-flex">
        <Sidebar userAuth={auth} onToggle={setSidebarOpen} />
        <main className={`content ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
          <Outlet context={{ userAuth: auth }} />
          <Footer />
        </main>
      </div>
    </div>
  );
};

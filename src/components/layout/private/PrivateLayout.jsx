import useAuth from "../../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import {Sidebar} from "../shared/sidebar/Sidebar";
import {Header} from "../shared/header/Header";

export const PrivateLayout = () => {
    const {auth, loading} = useAuth();

    return (
        <>
            {
                loading
                ?
                <div>Cargando..</div>
                :
                <div className="app">
                    <Header />
                    <Sidebar />
                    <main className="content">
                        {
                            auth.id ? <Outlet /> : <Navigate to="/login" />
                        }
                    </main>
                </div>
            }
        </>
    )
}
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
                        <div className="layout-container">
                            <Sidebar userAuth={auth} />
                            <main className="content">
                                {auth.id ? <Outlet context={{ userAuth: auth }} /> : <Navigate to="/login" />}
                            </main>
                        </div>
                    </div>
            }
        </>
    )
}
import useAuth from "../../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import {Sidebar} from "../shared/sidebar/Sidebar";
import {Header} from "../shared/header/Header";

export const PrivateLayout = () => {
    const {auth, loading} = useAuth();

    console.log('auth: ', auth);

    return (
        <>
            {
                loading
                ?
                <div>Cargando..</div>
                :
                <div className="app">
                    <Header />
                    <Sidebar userAuth={auth} />
                    <main className="content">
                        {
                            auth.id ? <Outlet context={{ userAuth: auth }} /> : <Navigate to="/login" />
                        }
                    </main>
                </div>
            }
        </>
    )
}
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../../hooks/useAuth";
import { clearAuthSession } from "../../../../../shared/auth/lib/authSession";
export const Logout = () => {

    const { setAuth } =  useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Limpia solo la sesión de autenticación.
        clearAuthSession();

        //Setear estados
        setAuth({});

        //Redirigir al login
        navigate("/login");
    });

    return (<div>Logout</div>)
}

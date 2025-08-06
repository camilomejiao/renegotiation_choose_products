import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../../hooks/useAuth";
export const Logout = () => {

    const { setAuth } =  useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        //Vacial el localstorage
        localStorage.clear();

        //Setear estados
        setAuth({});

        //Redirigir al login
        navigate("/login");
    });

    return (<div>Logout</div>)
}
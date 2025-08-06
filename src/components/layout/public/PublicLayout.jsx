import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export const PublicLayout = () => {

    const {auth} = useAuth();

    return (
        <>
            {
                !auth.id ? <Outlet /> : <Navigate to="/admin" />
            }
        </>
    )

}
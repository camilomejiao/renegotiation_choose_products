import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { hasForcedPasswordChange } from "../../../shared/auth/lib/authSession";

export const PublicLayout = () => {

    const {auth} = useAuth();
    const redirectPath = hasForcedPasswordChange(auth) ? "/admin/edit-user" : "/admin";

    return (
        <>
            {
                !auth.id ? <Outlet /> : <Navigate to={redirectPath} replace />
            }
        </>
    )

}

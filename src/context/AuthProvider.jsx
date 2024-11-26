import React from "react";
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    const authUser = async() => {
        //Sacar datos del usuario identificado
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('id');
        const user = localStorage.getItem('user');

        //comprobamos si tenemos informacion
        if(!token || !user_id) {
            return false;
        } else {
            const userObj = JSON.parse(user);
            setAuth({
                id: userObj?.proveedor ?? userObj?.user_id,
                rol_id: userObj?.rol
            });
            setLoading(false);
        }
    }

    useEffect(() => {
        authUser();
    }, []);

    return(
        <AuthContext.Provider value={{auth, setAuth, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
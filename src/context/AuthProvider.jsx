import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.clear();
        setAuth({});
    };

    const authUser = async() => {
        //Sacar datos del usuario identificado
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('id');
        const user = localStorage.getItem('user');

        //comprobamos si tenemos informacion
        if (!token || !user_id) {
            logout(); // Si no hay token o user_id, cerrar sesión automáticamente
            setLoading(false);
        } else {
            try {
                const userObj = JSON.parse(user);
                setAuth({
                    id: userObj?.proveedor ?? userObj?.user_id,
                    rol_id: userObj?.rol,
                });
            } catch (error) {
                console.error("Error parsing user data:", error);
                logout(); //Si el parseo falla, cerramos sesión
            } finally {
                setLoading(false); //Aseguramos que el estado de carga termine
            }
        }
    }

    const handleAuthUpdate = () => {
        //console.log("Detectado evento 'authUpdated', recargando auth...");
        authUser();
    };

    useEffect(() => {
        authUser();

        window.addEventListener("authUpdated", handleAuthUpdate);
    }, []);

    return(
        <AuthContext.Provider value={{auth, setAuth, loading, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
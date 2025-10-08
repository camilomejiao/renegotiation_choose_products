import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {authService} from "../../../../helpers/services/Auth";
import useAuth from "../../../../hooks/useAuth";

export const Conex = () => {
    const {setAuth} = useAuth();
    const navigate = useNavigate();

    const loadParams = async (uuid) => {
        try {
            const respConex = await authService.conex({uuid}).then((data) => {
                return data;
            });

            if(!respConex.access && !respConex.refresh) {
                navigate("/login");
                return;
            }

            // Guardar en el estado global de autenticación
            setAuth(respConex);

            //Lanzar un evento para actualizar AuthProvider sin recargar la página
            window.dispatchEvent(new Event("authUpdated"));

            //Esperar para asegurar que AuthProvider lo procese antes de redirigir
            setTimeout(() => {
                navigate("/admin");
            }, 1500);
            //13f8f72d-165b-4c87-b785-0e6b1a4f7818
        } catch (error) {
            console.error("No se encontró el token en la URL.");
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const uuid = queryParams.get("uuid");

        if (!uuid) {
            console.error("No se encontró el token en la URL.");
            navigate("/login");
            return;
        }

        loadParams(uuid);
    }, [navigate]);
}

import image from "../../../assets/image/404/404.png";
import { Link } from "react-router-dom";

export const PageNotFound = () => {
    return (
        <div className="page-standalone">
            <div className="surface-card page-standalone__content">
                <img src={image} alt="Página no encontrada" />
                <p className="text-soft">
                    La ruta que intentas consultar no existe o cambió. Te invitamos a regresar al panel
                    principal.
                </p>
                <Link to="/admin" className="button-pill">
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}

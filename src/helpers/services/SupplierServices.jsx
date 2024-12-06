import { Global } from "../Global";
import { authTokenService } from "./AuthTokenService";


class SupplierServices {

    /*
    * Obtener información de un proveedor
    */
    getInfoSupplier(){
        const url = `${Global.url}usuario/info/`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    saveLocationToLocalStorage(locationId, locationName) {
        localStorage.setItem("location_id", locationId);
        localStorage.setItem("location_name", locationName);
    }

    getLocation() {
        return {
            location_id: localStorage.getItem("location_id"),
            locationName: localStorage.getItem("location_name")
        };
    }
}

export const supplierServices = new SupplierServices();
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

    saveLocationToLocalStorage(locationKey, locationId, locationName) {
        localStorage.setItem("location_key", locationKey);
        localStorage.setItem("location_id", locationId);
        localStorage.setItem("location_name", locationName);
    }

    getLocation() {
        return {
            locationKey: localStorage.getItem("location_key"),
            location_id: localStorage.getItem("location_id"),
            locationName: localStorage.getItem("location_name")
        };
    }
}

export const supplierServices = new SupplierServices();
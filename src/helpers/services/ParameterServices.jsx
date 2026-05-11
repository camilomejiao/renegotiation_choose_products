import { GlobalConnex } from "../GlobalConnex";
import { authTokenService } from "./AuthTokenService";

class ParameterServices {
    getByTypeId(parameterTypeId) {
        const url = GlobalConnex.url + `lista/parametros/?tipo_parametro_id=${parameterTypeId}`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }
}

export const parameterServices = new ParameterServices();

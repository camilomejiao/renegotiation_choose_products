import { Global } from "../Global.jsx";
import { authTokenService } from "./AuthTokenService";

class ReportServices {

    async headlineReport(cubId) {
        let url = Global.url + "orden/reporte/cub/"+cubId+"/";
        return await authTokenService.fetchWithAuth(url, {
            method: "GET"
        });
    }

    async companyReport(startDate, endDate) {
        let url = Global.url + `orden/reporte/proveedor/?fecha_ini=${startDate}&fecha_fin=${endDate}`;
        return await authTokenService.fetchWithAuth(url, {
            method: "GET"
        });
    }

    async companyAndUserReport(cubId) {
        let url = Global.url + "orden/reporte/proveedor/"+cubId+"/";
        return await authTokenService.fetchWithAuth(url, {
            method: "GET"
        });
    }

}

export const reportServices = new ReportServices();
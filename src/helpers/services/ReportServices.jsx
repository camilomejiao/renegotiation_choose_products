import { Global } from "../Global.jsx";

class ReportServices {

    async headlineReport(cubId) {
        let url = Global.url + "orden/reporte/cub/"+cubId+"/";
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };

        const request = await fetch(url, {
            method: "GET",
            headers
        });

        return await request.json();
    }

    async companyReport() {
        let url = Global.url + "orden/reporte/proveedor/";
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };

        const request = await fetch(url, {
            method: "GET",
            headers
        });

        return await request.json();
    }

    async companyAndUserReport(cubId) {
        let url = Global.url + "orden/reporte/proveedor/"+cubId+"/";
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };

        const request = await fetch(url, {
            method: "GET",
            headers
        });

        return await request.json();
    }

}

export const reportServices = new ReportServices();
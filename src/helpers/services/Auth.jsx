import { Global } from "../Global.jsx";
import { jwtDecode } from "jwt-decode";

class Auth {

    //Login
    async login(data) {
        let params = JSON.stringify(data);
        let url = Global.url + "acceder/";
        let headers = {
            'Content-Type': 'application/json'
        };

        const request = await fetch(url, {
            method: "POST",
            body: params,
            headers,
            mode: "cors"
        });

        const resp = await request.json();
        console.log('resp-login: ', resp);

        // Verificar si los tokens están presentes en la respuesta
        if (resp.access && resp.refresh) {
            const decodeToken = await this.getTokenCode(resp.access);
            await this.saveStorage(resp, decodeToken);
            console.log('Tokens guardados correctamente');
        } else {
            console.error('Error: Los tokens no están presentes en la respuesta');
        }
        return resp;
    }

    //
    async saveStorage (token, decodeToken) {
        localStorage.setItem('id', decodeToken.proveedor);
        localStorage.setItem('token', token.access);
        localStorage.setItem('refresh', token.refresh);
        localStorage.setItem('user', JSON.stringify(decodeToken));
        localStorage.setItem('rol_id', decodeToken.rol);
    }

    async getUserId() {
        return localStorage.getItem('id');
    }

    async getTokenCode(token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        return decodedToken;
    }
}

export const authService = new Auth();
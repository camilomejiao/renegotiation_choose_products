import { Global } from "../Global.jsx";

class ProductsServices {

    //search product by name
    async searchProduct(searchData) {
        let url = Global.url + "producto/buscar/"+searchData+"/";
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

    async getProductId(id) {
        let url = Global.url + "producto/"+id+"/";
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

    async saveProducts(products, cubId) {
        let params = JSON.stringify(products);
        let url = Global.url + "orden/";
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };

        const request = await fetch(url, {
            method: "POST",
            body: params,
            headers,
        });

        if(request.status === 400) {
            const errorData = await request.json(); // Obtener el mensaje de error del servidor
            throw new Error(errorData); // Lanzamos el error para que sea capturado
        }

        return await request.json();
    }

}

export const productsServices = new ProductsServices();
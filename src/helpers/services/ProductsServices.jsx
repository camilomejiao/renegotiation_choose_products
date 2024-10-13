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

    async saveProducts(products) {

    }

}

export const productsServices = new ProductsServices();
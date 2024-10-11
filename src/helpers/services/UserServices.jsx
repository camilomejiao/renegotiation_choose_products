import { Global } from "../Global.jsx";
class UserService {

    //
    async searchUser(data){
        let url = Global.url + "cub/buscar/"+data+"/";
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

    async userInformation(cubId){
        let url = Global.url + "cub/"+cubId+"/";
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

export const userService = new UserService();
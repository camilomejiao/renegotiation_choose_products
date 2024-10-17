import { Global } from "../Global.jsx";
import { authTokenService } from "./AuthTokenService";
class UserService {

    //
    async searchUser(data) {
        let url = Global.url + "cub/buscar/" + data + "/";
        return await authTokenService.fetchWithAuth(url, {
            method: "GET"
        });
    }

    async userInformation(cubId){
        let url = Global.url + "cub/"+cubId+"/";
        return await authTokenService.fetchWithAuth(url, {
            method: "GET"
        });
    }
}

export const userService = new UserService();
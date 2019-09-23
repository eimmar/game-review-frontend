import axios from 'axios';
import AuthService from "./authService";

export const baseUrl = 'http://localhost:8000';

class DataApi {

    static get(path, params) {
        let config = AuthService.getAuthHeaders();
        config["data"] = params;
        return axios.get(baseUrl + path, config);
    }

    static post(path, params) {
        return axios.post(baseUrl + path, params, AuthService.getAuthHeaders());
    }

    static put(path, params) {
        return axios.put(baseUrl + path, params, AuthService.getAuthHeaders());
    }

    static delete(path, params) {
        let config = AuthService.getAuthHeaders();
        config["data"] = params;
        return axios.delete(baseUrl + path, config);
    }
}
export default DataApi;

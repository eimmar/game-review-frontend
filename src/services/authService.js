import axios from "axios";
import {baseUrl} from "./dataApi";
import jwt_decode from "jwt-decode";

class AuthService {
    static login(params) {
        return axios.post(baseUrl + '/api/auth/login', params).then(response => {
            if (response.status === 200 && response.data.token) {
                let token = response.data.token;
                let current_user = jwt_decode(token);
                current_user["access_token"] = token;
                localStorage.setItem("current_user", JSON.stringify(current_user));
            } else {
                throw new DOMException("Could not authenticate.")
            }
        });
    }

    static register(params) {
        return axios.post(baseUrl + '/api/auth/register', params);
    }

    static logout() {
        localStorage.removeItem("current_user");
    }

    static getCurrentUser() {
        return localStorage.getItem("current_user") ? JSON.parse(localStorage.getItem("current_user")) : false;
    }

    static getAuthHeaders() {
        let currentUser = AuthService.getCurrentUser();
        return {
            headers: {
                Authorization: currentUser ? "Bearer " + currentUser.access_token : "",
            }
        };
    }

    static hasRole(role) {
        let currentUser = this.getCurrentUser();
        return currentUser && currentUser.roles.includes(role);
    }

    static isUser() {
        return this.hasRole("ROLE_USER");
    }

    static isAdmin() {
        return this.hasRole("ROLE_ADMIN");
    }

    static isSuperAdmin() {
        return this.hasRole("ROLE_SUPER_ADMIN");
    }
}

export default AuthService;
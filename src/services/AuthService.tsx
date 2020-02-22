import axios from 'axios';
import JwtDecode from 'jwt-decode';

import { backendUrl } from '../parameters';

export interface User {
    email: string;
    accessToken: string;
}

interface LogInRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    email: string;
    password: string;
}

class AuthService {
    static login(params: LogInRequest) {
        return axios.post(`${backendUrl}/api/auth/login`, params).then((response) => {
            if (response.status === 200 && response.data.token) {
                const { token } = response.data;
                const currentUser = JwtDecode(token) as User;

                currentUser.accessToken = token;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                throw new DOMException('Could not authenticate.');
            }
        });
    }

    static register(params: RegisterRequest) {
        return axios.post(`${backendUrl}/api/auth/register`, params);
    }

    static logout() {
        localStorage.removeItem('current_user');
    }

    static getCurrentUser() {
        return localStorage.getItem('current_user') ? JSON.parse(localStorage.getItem('current_user') as string) : null;
    }

    static getAuthHeaders() {
        const currentUser = AuthService.getCurrentUser();

        return {
            headers: {
                Authorization: currentUser ? `Bearer ${currentUser.access_token}` : '',
            },
        };
    }

    static hasRole(role: string) {
        const currentUser = this.getCurrentUser();

        return currentUser && currentUser.roles.includes(role);
    }

    static isUser() {
        return this.hasRole('ROLE_USER');
    }

    static isAdmin() {
        return this.hasRole('ROLE_ADMIN');
    }

    static isSuperAdmin() {
        return this.hasRole('ROLE_SUPER_ADMIN');
    }
}

export default AuthService;

import axios from 'axios'
import JwtDecode from 'jwt-decode'

import { backendUrl } from '../parameters'

export interface User {
    email: string
    accessToken: string
}

export interface LogInRequest {
    email: string
    password: string
}

export interface RegistrationRequest {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface ForgotPasswordRequest {
    email: string
}

export interface ResetPasswordRequest {
    password: string
    repeatPassword: string
    guid: string
}

class AuthService {
    login(params: LogInRequest) {
        return axios.post(`${backendUrl}/api/auth/login`, params).then((response) => {
            if (response.status === 200 && response.data.token) {
                const { token } = response.data
                const currentUser = JwtDecode(token) as User

                currentUser.accessToken = token
                localStorage.setItem('currentUser', JSON.stringify(currentUser))
            } else {
                throw new DOMException('Could not authenticate.')
            }
        })
    }

    register(params: RegistrationRequest): Promise<any> {
        return axios.post(`${backendUrl}/api/auth/register`, params)
    }

    forgotPassword(params: ForgotPasswordRequest): Promise<any> {
        return axios.post(`${backendUrl}/api/auth/forgot-password`, params)
    }

    checkResetPassword(guid: string): Promise<boolean> {
        return axios.post(`${backendUrl}/api/auth/reset-password-check`, { guid })
    }

    resetPassword(params: ResetPasswordRequest): Promise<any> {
        return axios.post(`${backendUrl}/api/auth/reset-password`, params)
    }

    logout() {
        localStorage.removeItem('current_user')
    }

    getCurrentUser() {
        return localStorage.getItem('current_user') ? JSON.parse(localStorage.getItem('current_user') as string) : null
    }

    getAuthHeaders() {
        const currentUser = this.getCurrentUser()

        return {
            headers: {
                Authorization: currentUser ? `Bearer ${currentUser.access_token}` : '',
            },
        }
    }

    hasRole(role: string) {
        const currentUser = this.getCurrentUser()

        return currentUser && currentUser.roles.includes(role)
    }

    isUser() {
        return this.hasRole('ROLE_USER')
    }

    isAdmin() {
        return this.hasRole('ROLE_ADMIN')
    }

    isSuperAdmin() {
        return this.hasRole('ROLE_SUPER_ADMIN')
    }
}

export const authService = new AuthService()

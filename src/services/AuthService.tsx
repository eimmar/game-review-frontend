import JwtDecode from 'jwt-decode'
import cookie from 'react-cookies'

import { requestService } from './RequestService'

export interface User {
    id: string
    firstName: string
    lastName: string | null
    email: string
    accessToken: string
    roles: string[]
}

export interface LogInRequest {
    email: string
    password: string
}

export interface RegistrationRequest {
    firstName: string
    lastName: string | null
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
        // return axios.post(`${backendUrl}/api/auth/login`, params).then((response) => {
        //     if (response.status === 200 && response.data.token) {
        //         const { token } = response.data
        //         const currentUser = JwtDecode(token) as User
        //
        //         currentUser.accessToken = token
        //         localStorage.setItem('currentUser', JSON.stringify(currentUser))
        //     } else {
        //         throw new DOMException('Could not authenticate.')
        //     }
        // })

        return requestService.performRequest('POST', '/api/auth/login', params).then((response) => {
            if (response.status === 200 && response.data.token) {
                const { token } = response.data
                const currentUser = JwtDecode(token) as User

                currentUser.accessToken = token

                cookie.save('currentUser', currentUser.email, {})
                localStorage.clear()
                localStorage.setItem(currentUser.email, JSON.stringify(currentUser))

                return currentUser
            }
            throw new DOMException('Could not authenticate.')
        })
    }

    register(params: RegistrationRequest): Promise<any> {
        return requestService.performRequest('POST', '/api/auth/register', params)
    }

    forgotPassword(params: ForgotPasswordRequest): Promise<any> {
        return requestService.performRequest('POST', '/api/auth/forgot-password', params)
    }

    checkResetPassword(guid: string): Promise<boolean> {
        return requestService.performRequest('POST', '/api/auth/reset-password-check', { guid })
    }

    resetPassword(params: ResetPasswordRequest): Promise<any> {
        return requestService.performRequest('POST', '/api/auth/reset-password', params)
    }

    logout() {
        localStorage.removeItem('currentUser')
        cookie.remove('user')
    }

    getCurrentUser(): User | null {
        const userCookie = localStorage.getItem(cookie.load('currentUser'))

        return userCookie ? JSON.parse(userCookie) : null
    }

    getAuthHeaders() {
        const currentUser = this.getCurrentUser()

        return {
            headers: {
                Authorization: currentUser ? `Bearer ${currentUser.accessToken}` : '',
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

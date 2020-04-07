import JwtDecode from 'jwt-decode'
import cookie from 'react-cookies'

// eslint-disable-next-line import/no-cycle
import { requestService } from './RequestService'

export interface User {
    id: string
    firstName: string
    lastName: string | null
    email: string
    accessToken: string
    roles: string[]
    iat: number
    exp: number
}

export interface LogInRequest {
    email: string
    password: string
    rememberMe: boolean
}

interface LogInResponse {
    token?: string
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
        return requestService
            .performRequest('POST', '/api/auth/login', { ...params, username: params.email })
            .then((response: LogInResponse) => {
                if (response.token) {
                    const currentUser = JwtDecode(response.token) as User

                    currentUser.accessToken = response.token

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

    checkResetPassword(token: string): Promise<boolean> {
        return requestService.performRequest('POST', `/api/auth/reset-password-check/${token}`)
    }

    resetPassword(params: ResetPasswordRequest): Promise<any> {
        return requestService.performRequest('POST', '/api/auth/reset-password', params)
    }

    logout() {
        localStorage.removeItem(cookie.load('currentUser') || '')
        cookie.remove('currentUser')
    }

    getCurrentUser(): User | null {
        const userCookie = localStorage.getItem(cookie.load('currentUser'))

        return userCookie ? JSON.parse(userCookie) : null
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

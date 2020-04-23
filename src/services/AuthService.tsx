import JwtDecode from 'jwt-decode'
import cookie from 'react-cookies'

// eslint-disable-next-line import/no-cycle
import { requestService } from './RequestService'
// eslint-disable-next-line import/no-cycle
import { User } from './UserService'
import history from './History'
import { routes } from '../parameters'

export interface LoggedInUser extends User {
    accessToken: string
    iat: number
    exp: number
}

export interface LogInRequest {
    username: string
    password: string
    rememberMe: boolean
}

interface LogInResponse {
    token?: string
}

export interface RegistrationRequest {
    email: string
    username: string
    firstName: string
    lastName: string | null
    password: string
}

export interface ForgotPasswordRequest {
    email: string
}

export interface ResetPasswordRequest {
    password: string
    repeatPassword: string
}

class AuthService {
    login(params: LogInRequest) {
        return requestService.performRequest('POST', '/api/auth/login', params).then((response: LogInResponse) => {
            if (response.token) {
                const currentUser = JwtDecode(response.token) as LoggedInUser

                currentUser.accessToken = response.token

                cookie.save('currentUser', currentUser.username, {})
                localStorage.clear()
                localStorage.setItem(currentUser.username, JSON.stringify(currentUser))

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

    resetPassword(token: string, params: ResetPasswordRequest): Promise<any> {
        return requestService.performRequest('POST', `/api/auth/reset-password/${token}`, {
            plainPassword: {
                first: params.password,
                second: params.repeatPassword,
            },
        })
    }

    logout() {
        localStorage.removeItem(cookie.load('currentUser') || '')
        cookie.remove('currentUser')
    }

    getCurrentUser(): LoggedInUser | null {
        const userCookie = localStorage.getItem(cookie.load('currentUser'))

        return userCookie ? JSON.parse(userCookie) : null
    }

    update(user: User) {
        const currentUser = this.getCurrentUser()

        if (currentUser && currentUser.id === user.id) {
            localStorage.setItem(currentUser.username, JSON.stringify({ ...currentUser, ...user }))
        }
    }
}

export const authService = new AuthService()

export function authenticatedAction<Params extends any[]>(func: (...args: Params) => any): (...args: Params) => void {
    return (...args: Params) => {
        if (!authService.getCurrentUser()) {
            return history.push(routes.login, { referer: { url: history.location.pathname } })
        }

        return func(...args)
    }
}

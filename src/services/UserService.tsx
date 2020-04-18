// eslint-disable-next-line import/no-cycle
import { PaginatedList, requestService } from './RequestService'
// eslint-disable-next-line import/no-cycle
import { ChangePasswordRequest } from './AuthService'

export interface User extends UserUpdateRequest {
    id: string
    email: string
    roles: string[]
    createdAt: DateTimeObj
}

export interface UserUpdateRequest {
    firstName: string
    lastName: string | null
}

export interface UserFilterRequest {
    page?: string
    user?: string
    orderBy?: string
    order?: string
}

interface DateTimeObj {
    date: string
    timezone_type: number
    timezone: string
}

class UserService {
    baseUrl = '/api/user/'

    get(id: string): Promise<User> {
        return requestService.performRequest('GET', this.baseUrl + id)
    }

    getAll(search: string, pageSize: number): Promise<PaginatedList<User>> {
        const { page, user, orderBy, order } = requestService.getFilters(search) as UserFilterRequest

        return requestService.performRequest('POST', this.baseUrl, {
            pageSize,
            page: Number(page || 1),
            orderBy,
            order,
            filters: {
                query: user,
            },
        })
    }

    update(id: string, data: UserUpdateRequest): Promise<User> {
        return requestService.performRequest('POST', `${this.baseUrl}edit/${id}`, data)
    }

    changePassword(userId: string, params: ChangePasswordRequest): Promise<any> {
        return requestService.performRequest('POST', `${this.baseUrl}change-password/${userId}`, {
            // eslint-disable-next-line @typescript-eslint/camelcase
            current_password: params.currentPassword,
            plainPassword: {
                first: params.password,
                second: params.repeatPassword,
            },
        })
    }

    getInitials(user: User) {
        return (user.firstName.charAt(0) + (user.lastName?.charAt(0) || '')).toUpperCase()
    }

    getFullName(user: User) {
        return [user.firstName, user.lastName].join(' ').trim()
    }
}

export const userService = new UserService()

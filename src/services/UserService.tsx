// eslint-disable-next-line import/no-cycle
import { PaginatedList, requestService } from './RequestService'
// eslint-disable-next-line import/no-cycle
import { ResetPasswordRequest } from './AuthService'
import { backendUrl } from '../parameters'

export interface User {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string | null
    avatar: string | null
    roles: string[]
    enabled: boolean
    createdAt: string
    updatedAt: string
}

export interface UserUpdateRequest {
    firstName: string
    lastName: string | null
    avatarFile: UserAvatarFile
}

export interface UserAvatarFile {
    file: File | null
    delete: boolean
}

export interface ChangePasswordRequest extends ResetPasswordRequest {
    currentPassword: string
}

export interface UserFilterRequest {
    page?: string
    user?: string
    orderBy?: string
    order?: string
}

export type WithUser = User

class UserService {
    baseUrl = '/api/user/'

    get(username: string): Promise<User> {
        return requestService.performRequest('GET', this.baseUrl + username)
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

    getAllFromFilters(filters: UserFilterRequest, pageSize: number): Promise<PaginatedList<User>> {
        const { page, user, orderBy, order } = filters

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
        const formData = new FormData()

        formData.append('user_edit[firstName]', data.firstName)
        formData.append('user_edit[lastName]', data.lastName || '')
        data.avatarFile.file && formData.append('user_edit[avatarFile][file]', data.avatarFile.file)
        data.avatarFile.delete && formData.append('user_edit[avatarFile][delete]', '1')

        return requestService.performMultiPartRequest('POST', `${this.baseUrl}edit/${id}`, formData)
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

    getAvatarUrl(path: string) {
        return `${backendUrl}/images/users/${path}`
    }

    getFullName(user: User) {
        return [user.firstName, user.lastName].join(' ').trim()
    }
}

export const userService = new UserService()

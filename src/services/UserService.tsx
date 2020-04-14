// eslint-disable-next-line import/no-cycle
import { PaginatedList, requestService } from './RequestService'
import { phpDebug } from '../parameters'

export interface User {
    id: string
    firstName: string
    lastName: string | null
    email: string
    roles: string[]
    createdAt: DateTimeObj
}

export interface UserFilterRequest {
    page?: string
    query?: string
    orderBy?: string
    order?: string
}

interface DateTimeObj {
    date: string
    timezone_type: number
    timezone: string
}

class UserService {
    baseUrl = '/user/'

    get(id: string): Promise<User> {
        return requestService.performRequest('GET', this.baseUrl + id)
    }

    getAll(search: string, pageSize: number): Promise<PaginatedList<User>> {
        const { page, query, orderBy, order } = requestService.getFilters(search) as UserFilterRequest

        return requestService.performRequest('POST', this.baseUrl + phpDebug, {
            pageSize,
            page: Number(page || 1),
            orderBy,
            order,
            filters: {
                query,
            },
        })
    }

    getInitials(user: User) {
        return (user.firstName.charAt(0) + (user.lastName?.charAt(0) || '')).toUpperCase()
    }

    getFullName(user: User) {
        return [user.firstName, user.lastName].join(' ')
    }
}

export const userService = new UserService()

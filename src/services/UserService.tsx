// eslint-disable-next-line import/no-cycle
import { requestService } from './RequestService'

export interface User {
    id: string
    firstName: string
    lastName: string | null
    email: string
    roles: string[]
    createdAt: DateTimeObj
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
}

export const userService = new UserService()

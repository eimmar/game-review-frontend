import { PaginatedList, requestService, SearchRequest } from './RequestService'
import { WithUser } from './UserService'

export enum FriendshipStatus {
    Pending,
    Accepted,
}

export interface Friendship<T = WithUser | null> {
    sender: T
    receiver: T
    status: FriendshipStatus
    createdAt: string
    acceptedAt: string | null
}

class FriendshipService {
    baseUrl = '/api/friendship/'

    get(userId: string): Promise<Friendship<WithUser> | null> {
        return requestService.performRequest('GET', `${this.baseUrl}get/${userId}`)
    }

    add(userId: string): Promise<Friendship> {
        return requestService.performRequest('GET', `${this.baseUrl}add/${userId}`)
    }

    remove(userId: string) {
        return requestService.performRequest('GET', `${this.baseUrl}remove/${userId}`)
    }

    accept(userId: string): Promise<Friendship> {
        return requestService.performRequest('GET', `${this.baseUrl}accept/${userId}`)
    }

    getAll(request: SearchRequest): Promise<PaginatedList<Friendship<WithUser>>> {
        return requestService.performRequest('POST', this.baseUrl, request)
    }
}

export const friendshipService = new FriendshipService()

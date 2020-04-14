// eslint-disable-next-line import/no-cycle
import { requestService } from './RequestService'
import { authService } from './AuthService'

export enum GameListPrivacyType {
    Private = 1,
    FriendsOnly,
    Public,
}

export enum PredefinedListType {
    Favorites = 1,
    Wishlist,
    Playing,
}

export enum GameListType {
    Favorites = 1,
    Wishlist,
    Playing,
    Custom,
}

export interface GameList extends Timestampable {
    id: string
    privacyType: GameListPrivacyType
    type: GameListType
    name: string
}

export interface GameListUpdateRequest {
    privacyType: GameListPrivacyType
    name: string
}

export interface GameListRequest extends GameListUpdateRequest {
    user: string
    games: string[]
}

class GameListService {
    baseUrl = '/game-list/'

    addToPredefined(gameId: string, type: PredefinedListType): Promise<GameList> {
        return requestService.performRequest('POST', `${this.baseUrl}add/${type}/${gameId}`)
    }

    removeFromPredefined(gameId: string, type: PredefinedListType): Promise<GameList> {
        return requestService.performRequest('POST', `${this.baseUrl}remove/${type}/${gameId}`)
    }

    addToList(gameId: string, listId: string): Promise<GameList> {
        return requestService.performRequest('POST', `${this.baseUrl}${listId}/add/${gameId}`)
    }

    removeFromList(gameId: string, listId: string): Promise<GameList> {
        return requestService.performRequest('POST', `${this.baseUrl}${listId}/remove/${gameId}`)
    }

    create(data: GameListRequest): Promise<GameList> {
        return requestService.performRequest('POST', `${this.baseUrl}new`, data)
    }

    update(id: string, data: GameListUpdateRequest): Promise<GameList> {
        return requestService.performRequest('POST', `${this.baseUrl}edit/${id}`, data)
    }

    getListsContaining(gameId: string): Promise<GameList[]> {
        if (authService.getCurrentUser()) {
            return requestService.performRequest('GET', `${this.baseUrl}containing/${gameId}`)
        }

        return requestService.performRequest('GET', `${this.baseUrl}containing/${gameId}`)
    }

    getAllForUser(userId: string): Promise<GameList[]> {
        return requestService.performRequest('GET', `${this.baseUrl}user/${userId}`)
    }

    delete(id: string) {
        return requestService.performRequest('DELETE', this.baseUrl + id)
    }
}

export const gameListService = new GameListService()

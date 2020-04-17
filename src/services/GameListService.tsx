import { requestService } from './RequestService'

export enum GameListPrivacyType {
    Private = 1,
    FriendsOnly,
    Public,
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
    baseUrl = '/api/game-list/'

    addToList(gameId: string, listId: string): Promise<GameList> {
        return requestService.performRequest('POST', `${this.baseUrl}${listId}/add/${gameId}`)
    }

    removeFromList(gameId: string, listId: string): Promise<GameList> {
        return requestService.performRequest('POST', `${this.baseUrl}${listId}/remove/${gameId}`)
    }

    get(id: string): Promise<GameList> {
        return requestService.performRequest('GET', this.baseUrl + id)
    }

    create(data: GameListRequest): Promise<GameList> {
        return requestService.performRequest('POST', `${this.baseUrl}new`, data)
    }

    update(id: string, data: GameListUpdateRequest): Promise<GameList> {
        return requestService.performRequest('POST', `${this.baseUrl}edit/${id}`, data)
    }

    getUserListsContainingGame(userId: string, gameId: string): Promise<GameList[]> {
        return requestService.performRequest('GET', `${this.baseUrl}containing/game/${gameId}/user/${userId}`)
    }

    getAllForUser(userId: string): Promise<GameList[]> {
        return requestService.performRequest('GET', `${this.baseUrl}user/${userId}`)
    }

    delete(id: string) {
        return requestService.performRequest('DELETE', this.baseUrl + id)
    }
}

export const gameListService = new GameListService()

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
    Played,
}

export enum GameListType {
    Favorites = 1,
    Wishlist,
    Played,
    Custom,
}

export interface GameList extends Timestampable {
    id: string
    privacyType: GameListPrivacyType
    type: GameListType
    name: string
    description: string | null
}

class GameListService {
    baseUrl = '/game-list/'

    addToPredefined(gameId: string, type: PredefinedListType): Promise<GameList> {
        return requestService.performRequest('POST', `${this.baseUrl}add/${type}/${gameId}`)
    }

    removeFromPredefined(gameId: string, type: PredefinedListType): Promise<GameList> {
        return requestService.performRequest('POST', `${this.baseUrl}remove/${type}/${gameId}`)
    }

    create(data: GameList) {
        return requestService.performRequest('POST', `${this.baseUrl}new`, data)
    }

    get(id: string) {
        return requestService.performRequest('GET', this.baseUrl + id)
    }

    getListsContaining(gameId: string): Promise<GameList[]> {
        if (authService.getCurrentUser()) {
            return requestService.performRequest('GET', `${this.baseUrl}containing/${gameId}`)
        }

        return requestService.performRequest('GET', `${this.baseUrl}containing/${gameId}`)
    }

    getAll() {
        return requestService.performRequest('GET', this.baseUrl)
    }

    delete(id: string) {
        return requestService.performRequest('DELETE', this.baseUrl + id)
    }
}

export const gameListService = new GameListService()

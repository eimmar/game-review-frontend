// eslint-disable-next-line import/no-cycle
import { Game } from './GameService'
import { requestService } from './RequestService'

export enum GameListPrivacyType {
    Private = 1,
    FriendsOnly,
    Public,
}

export enum GameListType {
    Favorites = 1,
    Wishlist,
    Played,
    Custom,
}

export interface GameList extends Timestampable {
    id: string
    games: Game[]
    privacyType: GameListPrivacyType
    type: GameListType
    name: string
    description: string | null
}

class GameListService {
    baseUrl = '/game-list/'

    getAll(): Promise<GameList[]> {
        return requestService.performRequest('GET', this.baseUrl)
    }

    get(id: string) {
        return requestService.performRequest('GET', this.baseUrl + id)
    }
}

export const gameListService = new GameListService()

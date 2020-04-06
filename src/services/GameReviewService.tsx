import { PaginatedList, Pagination, requestService } from './RequestService'
import { Game } from './GameService'
import { User } from './AuthService'

export interface GameReview extends Timestampable {
    id: string
    game: Game
    user: User
    title: string
    comment: string
    pros: string | null
    cons: string | null
    rating: number
}

export interface GameReviewRequest {
    gameId: string
    userId: string
    title: string
    comment: string
    pros: string | null
    cons: string | null
    rating: number
}

class ReviewService {
    baseUrl = '/review/'

    getAllForGame(gameId: string, pagination: Pagination): Promise<PaginatedList<GameReview>> {
        return requestService.performRequest('GET', this.baseUrl + gameId, pagination)
    }

    get(id: string) {
        return requestService.performRequest('GET', this.baseUrl + id)
    }

    create(data: GameReviewRequest) {
        return requestService.performAuthenticatedRequest('POST', this.baseUrl, data)
    }
}

export const reviewService = new ReviewService()

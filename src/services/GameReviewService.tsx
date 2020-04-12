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
    game: string
    user: string
    title: string
    comment: string
    pros: string | null
    cons: string | null
    rating: number
}

class ReviewService {
    baseUrl = '/review/'

    getAllForGame(gameId: string, pagination: Pagination): Promise<PaginatedList<GameReview>> {
        return requestService.performRequest('POST', `${this.baseUrl}game/${gameId}`, pagination)
    }

    getAllForUser(userId: string, pagination: Pagination): Promise<PaginatedList<GameReview>> {
        return requestService.performRequest('POST', `${this.baseUrl}user/${userId}`, pagination)
    }

    get(id: string) {
        return requestService.performRequest('GET', this.baseUrl + id)
    }

    create(data: GameReviewRequest) {
        return requestService.performRequest('POST', this.baseUrl, data)
    }
}

export const reviewService = new ReviewService()

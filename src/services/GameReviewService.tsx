import { PaginatedList, Pagination, requestService } from './RequestService'
import { Game } from './GameService'
import { User } from './UserService'

export interface GameReview extends Timestampable {
    id: string
    game: Game
    user: User
    title: string
    comment: string
    pros: string | null
    cons: string | null
    rating: number
    approved: boolean
}

export type ProsCons = 'pros' | 'cons'

export type GameReviewRequest = {
    [key in ProsCons]: string | string[] | number
} & {
    game: string
    user: string
    title: string
    comment: string
    pros: string[]
    cons: string[]
    rating: number
}

class ReviewService {
    baseUrl = '/api/review/'

    getAllForGame(gameId: string, pagination: Pagination): Promise<PaginatedList<GameReview>> {
        return requestService.performRequest('POST', `${this.baseUrl}game/${gameId}`, pagination)
    }

    getAllForUser(userId: string, pagination: Pagination): Promise<PaginatedList<GameReview>> {
        return requestService.performRequest('POST', `${this.baseUrl}user/${userId}`, pagination)
    }

    get(id: string) {
        return requestService.performRequest('GET', this.baseUrl + id)
    }

    create(data: GameReviewRequest): Promise<GameReview> {
        return requestService.performRequest('POST', this.baseUrl, data)
    }

    update(id: string, data: GameReviewRequest): Promise<GameReview> {
        return requestService.performRequest('POST', `${this.baseUrl}edit/${id}`, data)
    }

    delete(id: string) {
        return requestService.performRequest('DELETE', this.baseUrl + id)
    }

    toFormData(review: GameReview): GameReviewRequest {
        const { id, createdAt, updatedAt, approved, ...formData } = review

        return {
            ...formData,
            game: formData.game.id,
            user: formData.user.id,
            pros: (formData.pros || '').split('|'),
            cons: (formData.cons || '').split('|'),
        }
    }
}

export const reviewService = new ReviewService()

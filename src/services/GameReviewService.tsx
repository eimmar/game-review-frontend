import { requestService } from './RequestService'

export interface GameReview extends Timestampable {
    id: string
    commend: string
    rating: number
}

class ReviewService {
    baseUrl = '/review/'

    getAll(): Promise<GameReview[]> {
        return requestService.performRequest('GET', this.baseUrl)
    }

    get(id: string) {
        return requestService.performRequest('GET', this.baseUrl + id)
    }

    create(data: any) {
        return requestService.performAuthenticatedRequest('POST', this.baseUrl, this.prepareReviewData(data))
    }

    prepareReviewData(data: any) {
        return {
            comment: data.comment,
            vehicle: data.vehicle.id,
            rating: data.rating,
        }
    }
}

export const reviewService = new ReviewService()

import { Pagination, requestService } from './RequestService'

interface UserRating {
    rating: number
}

export interface Video {
    id: number
    trusted: boolean
    url: string
}

export interface Review {
    id: number
    conclusion?: string
    content?: string
    createdAt: number
    introduction?: string
    negativePoints?: string
    positivePoints?: string
    title: string
    userRating?: UserRating
    video?: Video
}

class IGDBService {
    baseUrl = '/api/igdb/'

    reviews(id: number, request: Pagination): Promise<Review[]> {
        return requestService.performRequest('POST', `${this.baseUrl}reviews/${id}`, request)
    }
}

export const igdbService = new IGDBService()

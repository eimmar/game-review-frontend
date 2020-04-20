import { requestService } from './RequestService'

interface Request {
    format: 'json' | 'xml' | 'jsonp'
    fieldList?: string[]
    limit?: number
    offset?: number
    sort?: string
    filter?: { [key: string]: string }[]
}

interface Response<T> {
    error: string
    limit: number
    offset: number
    numberOfPageResults: number
    numberOfTotalResults: number
    statusCode: number
    results: T[]
    version: string
}

interface AssocImage {
    squareTiny: string
    screenTiny: string
    squareSmall: string
    original: string
}

export interface Review {
    id?: number
    authors?: string
    title?: string
    image?: AssocImage
    score?: string
    deck?: string
    good?: string
    bad?: string
    body?: string
    lede?: string
    game?: object
    releases?: object[]
    siteDetailUrl?: string
    publishDate?: string
    updateDate?: string
    reviewType?: 'primary' | 'secondary' | 'second_take'
}

export interface Video {
    id?: string
    title?: string
    image?: AssocImage
    deck?: string
    lowUrl?: string
    highUrl?: string
    hdUrl?: string
    lengthSeconds?: string
    publishDate?: string
    siteDetailUrl?: string
    source?: string
    categories?: string
    show?: string
    associations?: object
}

class GameSpotService {
    baseUrl = '/api/game-spot/'

    reviews(id: string, request: Request): Promise<Response<Review>> {
        return requestService.performRequest('POST', `${this.baseUrl}reviews/${id}`, request)
    }

    videos(id: string, request: Request): Promise<Response<Video>> {
        return requestService.performRequest('POST', `${this.baseUrl}videos/${id}`, request)
    }
}

export const gameSpotService = new GameSpotService()

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

export interface Article {
    id?: number
    authors?: string
    title?: string
    deck?: string
    lede?: string
    body?: string
    image?: AssocImage
    categories?: object[]
    associations?: object[]
    publishDate?: string
    videosApiUrl?: string
    siteDetailUrl?: string
}

export interface Image {
    siteDetailUrl?: string
    iconUrl?: string
    mediumUrl?: string
    screenUrl?: string
    smallUrl?: string
    superUrl?: string
    thumbUrl?: string
    tinyUrl?: string
    screenTiny?: string
    squareTiny?: string
    original?: string
}

export interface Video {
    id?: string
    title?: string
    image?: AssocImage
    deck?: string
    lowUrl?: string
    highUrl?: string
    hdUrl?: string
    length_seconds?: string
    publish_date?: string
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

    articles(id: string, request: Request): Promise<Response<Article>> {
        return requestService.performRequest('POST', `${this.baseUrl}articles/${id}`, request)
    }

    images(id: string, request: Request): Promise<Response<Image>> {
        return requestService.performRequest('POST', `${this.baseUrl}images/${id}`, request)
    }

    videos(id: string, request: Request): Promise<Response<Video>> {
        return requestService.performRequest('POST', `${this.baseUrl}videos/${id}`, request)
    }
}

export const gameSpotService = new GameSpotService()

import { requestService } from './RequestService'

interface ResponseMeta {
    currency: string
}

interface Shop {
    id: string
    name: string
}

interface SearchRequest {
    query: string
    offset?: number
    limit?: number
    region?: string
    country?: string
    shops?: string[]
}

interface GameUrl {
    game: string
    buy: string
}

interface SearchListUrl {
    deals: string
}

interface GameList {
    list: GameDeal[]
    urls: SearchListUrl
}

interface SearchResponse {
    '.meta': ResponseMeta
    data: GameList
}

export interface GameDeal {
    plain: string
    title: string
    priceNew: number
    priceOld: number
    priceCut: number
    added: number
    shop: Shop
    drm: string[]
    urls: GameUrl
}

class GameDealService {
    baseUrl = '/api/any-deal/'

    search(request: SearchRequest): Promise<SearchResponse> {
        return requestService.performRequest('POST', `${this.baseUrl}search`, request)
    }
}

export const gameDealService = new GameDealService()

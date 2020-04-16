import { requestService } from './RequestService'

interface PriceRequest {
    plains: string[]
    region?: string
    country?: string
    shops?: string[]
    exclude?: string[]
    added?: number
}

interface ResponseMeta {
    currency: string
}

interface ListUrl {
    game: string
}

interface ResponsePlainData {
    list: PriceDeal[]
    urls: ListUrl
}

interface ResponsePlain {
    [key: string]: ResponsePlainData
}

interface PriceResponse {
    '.meta': ResponseMeta
    data: ResponsePlain
}

interface Shop {
    id: string
    name: string
}

export interface PriceDeal {
    priceNew: number
    priceOld: number
    priceCut: number
    url: string
    shop: Shop
    drm: string[]
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

    prices(request: PriceRequest): Promise<PriceResponse> {
        return requestService.performRequest('POST', `${this.baseUrl}game-prices`, request)
    }

    search(request: SearchRequest): Promise<SearchResponse> {
        return requestService.performRequest('POST', `${this.baseUrl}search`, request)
    }
}

export const gameDealService = new GameDealService()

import { Pagination, requestService } from './RequestService'
import { Game, GameLoaded, GamesFilterRequest } from './GameService'
import { phpDebug } from '../parameters'
import { ensureArray } from './Util/PageSpeed'

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

interface Anything {
    [key: string]: any
}

class IGDBService {
    baseUrl = '/api/igdb/'

    reviews(gameId: number, request: Pagination): Promise<Review[]> {
        return requestService.performRequest('POST', `${this.baseUrl}reviews/${gameId}`, request)
    }

    getAllFromSearch(searchString: string, limit: number): Promise<Game[]> {
        const filters = (requestService.getFilters(searchString) as unknown) as GamesFilterRequest

        return this.getAllFromFilters(filters, limit)
    }

    getAllFromFilters(filters: GamesFilterRequest, limit: number): Promise<Game[]> {
        return requestService.performRequest(
            'POST',
            `${this.baseUrl}games${phpDebug}`,
            this.getRequestBody(filters, limit),
        )
    }

    game(slug: string): Promise<GameLoaded> {
        return requestService.performRequest('POST', `${this.baseUrl}game/${slug}`)
    }

    getRequestBody(request: GamesFilterRequest, limit: number) {
        const offset = (Number(request.page || 1) - 1) * limit
        const sort = request.query ? undefined : `${request.orderBy || 'first_release_date'} ${request.order || 'desc'}`
        const search = request.query
        let where: Anything = {}

        if (request.category) {
            where.category = `= (${ensureArray(request.category).join(', ')})`
        }

        if (request.genre) {
            where['genres.slug'] = `= ("${ensureArray(request.genre).join('", "')}")`
        }

        if (request.theme) {
            where['themes.slug'] = `= ("${ensureArray(request.theme).join('", "')}")`
        }

        if (request.platform) {
            where['platforms.slug'] = `= ("${ensureArray(request.platform).join('", "')}")`
        }

        if (request.gameMode) {
            where['game_modes.slug'] = `= ("${ensureArray(request.gameMode).join('", "')}")`
        }

        if (request.ratingFrom) {
            where.total_rating = `>= ${request.ratingFrom}`
        }

        if (request.ratingTo) {
            const previousPart = where.total_rating ? `${where.total_rating} & total_rating ` : ''

            where.total_rating = `${previousPart}<= ${request.ratingTo}`
        }

        if (request.releaseDateFrom) {
            where.first_release_date = `>= ${new Date(request.releaseDateFrom).getTime() / 1000}`
        }

        if (request.releaseDateTo) {
            const previousPart = where.first_release_date ? `${where.first_release_date} & first_release_date ` : ''

            where.first_release_date = `${previousPart}<= ${new Date(request.releaseDateTo).getTime() / 1000}`
        }

        if (request.orderBy === 'total_rating') {
            where.total_rating = '!= null'
            where.total_rating_count = '>= 20'
        }

        where = where || { first_release_date: `<= ${new Date().getTime()}` }

        return { limit, offset, sort, search, where }
    }
}

export const igdbService = new IGDBService()

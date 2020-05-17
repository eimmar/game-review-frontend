import { Pagination, requestService } from './RequestService'
import { Game, GameLoaded, GamesFilterRequest } from './GameService'

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

    reviews(gameId: number, request: Pagination): Promise<Review[]> {
        return requestService.performRequest('POST', `${this.baseUrl}reviews/${gameId}`, request)
    }

    getAllFromSearch(searchString: string, limit: number, offset: number): Promise<Game[]> {
        const filters = (requestService.getFilters(searchString) as unknown) as GamesFilterRequest

        return this.getAllFromFilters(filters, limit, offset)
    }

    getAllFromFilters(filters: GamesFilterRequest, pageSize: number, firstResult: number): Promise<Game[]> {
        const {
            page,
            query,
            releaseDateFrom,
            releaseDateTo,
            category,
            ratingFrom,
            ratingTo,
            ratingCountFrom,
            ratingCountTo,
            genre,
            theme,
            platform,
            gameMode,
            orderBy,
            order,
        } = filters

        return requestService.performRequest('POST', `${this.baseUrl}games`, {
            pageSize,
            page: Number(page || 1),
            firstResult,
            orderBy,
            order,
            filters: {
                query,
                releaseDateFrom,
                releaseDateTo,
                category,
                ratingFrom,
                ratingTo,
                ratingCountFrom,
                ratingCountTo,
                genre,
                theme,
                platform,
                gameMode,
            },
        })
    }

    game(slug: string): Promise<GameLoaded> {
        return requestService.performRequest('POST', `${this.baseUrl}game/${slug}`)
    }

    getMaxPage(pageSize: number) {
        return 5000 / pageSize + 1
    }
}

export const igdbService = new IGDBService()

import { PaginatedList, requestService } from './RequestService'

export enum GameCategory {
    MainGame,
    DlcAddon,
    Expansion,
    Bundle,
    StandaloneExpansion,
    Mod,
    Episode,
    Season,
}

export enum AgeRatingCategory {
    ESRB = 1,
    PEGI = 2,
}

export enum PlatformCategory {
    Console = 1,
    Arcade = 2,
    Platform = 3,
    OperatingSystem = 4,
    PortableConsole = 5,
    Computer = 6,
}

export enum GameWebsiteCategory {
    Official = 1,
    Wikia,
    Wikipedia,
    Facebook,
    Twitter,
    Twitch,
    Instagram = 8,
    Youtube,
    Iphone,
    Ipad,
    Android,
    Steam,
    Reddit,
    Itch,
    EpicGames,
    Gog,
}

export enum ScreenshotSize {
    CoverSmall = 't_cover_small',
    ScreenshotMed = 't_screenshot_med',
    CoverBig = 't_cover_big',
    LogoMed = 't_logo_med',
    ScreenshotBig = 't_screenshot_big',
    ScreenshotHuge = 't_screenshot_huge',
    Thumb = 't_thumb',
    Micro = 't_micro',
    P720 = 't_720p',
    P1080 = 't_1080p',
}

export interface AgeRating extends ExternalEntity {
    id: string
    synopsis: string | null
    category: AgeRatingCategory
    rating: number
}

export interface Genre extends Timestampable, ExternalEntity {
    id: string
    name: string
    slug: string
    url: string
}

export interface Screenshot extends Timestampable, ExternalEntity {
    id: string
    imageId: string
    url: string
    height: number
    width: number
}

export interface Theme extends Timestampable, ExternalEntity {
    id: string
    name: string
    slug: string
    url: string
}

export interface Platform extends Timestampable, ExternalEntity {
    id: string
    name: string
    slug: string
    abbreviation: string
    summary: string | null
    url: string
    category: PlatformCategory
}

export interface GameMode extends Timestampable, ExternalEntity {
    id: string
    name: string
    slug: string
    url: string
}

export interface GameWebsite extends Timestampable, ExternalEntity {
    id: string
    trusted: boolean
    url: string
    category: GameWebsiteCategory
}

export interface CompanyWebsite extends GameWebsite {}

export interface Company extends Timestampable, ExternalEntity {
    id: string
    name: string
    description: string | null
    websites: CompanyWebsite[]
    url: string
}

export type DB = string

export type API = null

export type DataOrigin = DB | API

export interface Game<T extends DataOrigin = DB> extends Timestampable<T>, ExternalEntity {
    id: T
    name: string
    slug: string
    coverImage: string | null
    summary: string | null
    releaseDate: string | null
    category: GameCategory
    rating: number | null
    ratingCount: number | null
    gameSpotAssociation: string | null
}

export interface GameLoaded extends Game {
    storyLine: string | null
    ageRatings: AgeRating[]
    genres: Genre[]
    screenshots: Screenshot[]
    themes: Theme[]
    platforms: Platform[]
    gameModes: GameMode[]
    websites: GameWebsite[]
    companies: Company[]
}

export interface GamesFilterRequest {
    page?: string
    query?: string
    releaseDateFrom?: string
    releaseDateTo?: string
    category?: string | string[]
    ratingFrom?: string
    ratingTo?: string
    ratingCountFrom?: string
    ratingCountTo?: string
    genre?: string | string[]
    theme?: string | string[]
    platform?: string | string[]
    gameMode?: string | string[]
    orderBy?: string
    order?: 'asc' | 'desc'
    [key: string]: string | string[] | undefined
}

export interface GameEntityFilterValues {
    genres: Genre[]
    themes: Theme[]
    platforms: Platform[]
    gameModes: GameMode[]
}

class GameService {
    baseUrl = '/api/game/'

    getAllFromSearch(search: string, pageSize: number): Promise<PaginatedList<Game>> {
        const {
            page,
            query,
            releaseDateFrom,
            releaseDateTo,
            category,
            ratingFrom,
            ratingTo,
            genre,
            theme,
            platform,
            gameMode,
            orderBy,
            order,
        } = (requestService.getFilters(search) as unknown) as GamesFilterRequest

        return requestService.performRequest('POST', this.baseUrl, {
            pageSize,
            page: Number(page || 1),
            orderBy,
            order,
            filters: {
                query,
                releaseDateFrom,
                releaseDateTo,
                category,
                ratingFrom,
                ratingTo,
                genre,
                theme,
                platform,
                gameMode,
            },
        })
    }

    getAllFromFilters(filters: GamesFilterRequest, pageSize: number): Promise<PaginatedList<Game>> {
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

        return requestService.performRequest('POST', this.baseUrl, {
            pageSize,
            page: Number(page || 1),
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

    getAllForList(listId: string, page: number, pageSize: number, firstResult?: number): Promise<Game[]> {
        return requestService.performRequest('POST', `${this.baseUrl}list/${listId}`, { pageSize, page, firstResult })
    }

    get(slug: string): Promise<GameLoaded> {
        return requestService.performRequest('GET', this.baseUrl + slug)
    }

    withCover<T extends Game>(game: T, size: ScreenshotSize): T {
        return {
            ...game,
            coverImage: game.coverImage ? `https:${game.coverImage?.replace(ScreenshotSize.Thumb, size)}` : null,
        }
    }

    getScreenshots(game: GameLoaded, size: ScreenshotSize): Screenshot[] {
        return game.screenshots.map((it) => ({ ...it, url: `https:${it.url.replace(ScreenshotSize.Thumb, size)}` }))
    }

    transformImage(imageUrl: string, fromSize: ScreenshotSize, toSize: ScreenshotSize) {
        return imageUrl.replace(fromSize, toSize)
    }
}

export const gameService = new GameService()

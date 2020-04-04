import { requestService } from './RequestService'

export enum GameCategory {
    MainGame,
    DlcAddon,
    Expansion,
    Bundle,
    StandaloneExpansion,
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
    url: string
}

export interface Platform extends Timestampable, ExternalEntity {
    id: string
    name: string
    abbreviation: string
    summary: string | null
    url: string
    category: PlatformCategory
}

export interface GameMode extends Timestampable, ExternalEntity {
    id: string
    name: string
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

export interface Game extends Timestampable, ExternalEntity {
    id: string
    name: string
    coverImage: string | null
    summary: string | null
    storyLine: string | null
    releaseDate: string | null
    category: GameCategory
    rating: number | null
    ratingCount: number | null
}

export interface GameLoaded extends Game {
    ageRatings: AgeRating[]
    genres: Genre[]
    screenshots: Screenshot[]
    themes: Theme[]
    platforms: Platform[]
    gameModes: GameMode[]
    websites: GameWebsite[]
    companies: Company[]
}

class GameService {
    baseUrl = '/game/'

    getAll(): Promise<Game[]> {
        return requestService.performRequest('GET', this.baseUrl)
    }

    get(id: string): Promise<GameLoaded> {
        return requestService.performRequest('GET', this.baseUrl + id)
    }

    withCover<T extends Game>(game: T, size: ScreenshotSize): T {
        return { ...game, coverImage: game.coverImage ? game.coverImage?.replace(ScreenshotSize.Thumb, size) : null }
    }

    getScreenshots(game: GameLoaded, size: ScreenshotSize): Screenshot[] {
        return game.screenshots.map((it) => ({ ...it, url: it.url.replace(ScreenshotSize.Thumb, size) }))
    }

    transformImage(imageUrl: string, fromSize: ScreenshotSize, toSize: ScreenshotSize) {
        return imageUrl.replace(fromSize, toSize)
    }
}

export const gameService = new GameService()

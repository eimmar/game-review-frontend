// eslint-disable-next-line import/no-cycle
import { GameList } from './GameListService'
import { GameReview } from './GameReviewService'
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
    Instagram,
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
    reviews: GameReview[]
    gameLists: GameList[]
}

class GameService {
    baseUrl = '/game/'

    getAll(): Promise<Game[]> {
        return requestService.performRequest('GET', this.baseUrl)
    }

    get(id: string) {
        return requestService.performRequest('GET', this.baseUrl + id)
    }

    withBigCover(games: Game[]) {
        return games.map((game) => {
            return { ...game, coverImage: game.coverImage ? game.coverImage?.replace('t_thumb', 't_cover_big') : null }
        })
    }
}

export const gameService = new GameService()

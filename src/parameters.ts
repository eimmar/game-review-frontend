export const backendUrl = 'http://localhost:8000'

export const routes = {
    homePage: '/',
    register: '/registracija',
    login: '/prisijungimas',
    logout: '/atsijungti',
    forgotPassword: '/pamirsau-slaptazodi',
    resetPassword: '/atstatyti-slaptazodi',

    game: {
        list: '/zaidimai',
        view: '/zaidimas',
    },

    gameList: {
        view: '/zaidimu-sarasas',
    },

    user: {
        profile: '/profilis',
        profileEdit: '/profilis/redaguoti',
        changePassword: '/profilis/keisti-slaptazodi',
        view: '/zaidejas',
        list: '/bendruomene',
    },
}

export const igdbReviews = 'https://www.igdb.com/reviews'

export const phpDebug = '?XDEBUG_SESSION_START=PHPSTORM'

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
        friendList: '/draugai',
        friendInvites: '/kvietimai-draugauti',
        profile: '/profilis',
        profileEdit: '/profilis/redaguoti',
        changePassword: '/profilis/keisti-slaptazodi',
        view: '/zaidejas',
        list: '/bendruomene',
    },
}

export const storage = {
    user: 'currentUser',
    partialContentWarningShown: 'partialContentWarningShown',
}

export const params = {
    partialContentWarningMaxAge: 3600,
}

export const igdbReviews = 'https://www.igdb.com/reviews'

export const phpDebug = '?XDEBUG_SESSION_START=PHPSTORM'

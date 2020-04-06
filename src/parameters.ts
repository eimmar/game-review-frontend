export const backendUrl = 'http://localhost:8000'

export const routes = {
    homePage: '/',
    register: '/register',
    login: '/login',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',

    game: {
        list: '/games',
        view: '/game',
    },
}

export const phpDebug = '?XDEBUG_SESSION_START=PHPSTORM'

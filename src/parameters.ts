export const backendUrl = 'http://localhost:8000'

export const routes = {
    homePage: '/',
    register: '/registracija',
    login: '/prisijungimas',
    forgotPassword: '/pamirsau-slaptazodi',
    resetPassword: '/atstatyti-slaptazodi',

    game: {
        list: '/zaidimai',
        view: '/zaidimas',
    },

    user: {
        profile: '/profilis',
        view: '/naudotojas',
        list: '/bendruomene',
    },
}

export const phpDebug = '?XDEBUG_SESSION_START=PHPSTORM'

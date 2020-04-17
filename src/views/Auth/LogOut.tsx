import * as React from 'react'
import { Redirect } from 'react-router-dom'

import { authService } from '../../services/AuthService'
import NotFound404 from '../Error/NotFound404'
import { routes } from '../../parameters'

export default function LogOut() {
    const user = authService.getCurrentUser()

    if (!user) {
        return <NotFound404 />
    }
    authService.logout()

    return <Redirect to={routes.homePage} />
}

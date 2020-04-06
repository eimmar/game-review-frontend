import * as React from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'

import { authService } from '../services/AuthService'
import { routes } from '../parameters'

export class PublicOnlyRoute extends React.PureComponent<RouteProps> {
    render() {
        if (authService.getCurrentUser()) {
            return <Redirect to={routes.homePage} />
        }

        return <Route {...this.props} />
    }
}

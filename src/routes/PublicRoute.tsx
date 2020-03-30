import * as React from 'react'
import { Route, RouteProps } from 'react-router-dom'

export class PublicRoute extends React.PureComponent<RouteProps> {
    render() {
        return <Route {...this.props} />
    }
}

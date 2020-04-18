import { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

class ScrollToTop extends Component<RouteComponentProps> {
    componentDidUpdate(prevProps: RouteComponentProps) {
        const { location } = this.props

        if (location !== prevProps.location) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    render() {
        const { children } = this.props

        return children
    }
}

export default withRouter(ScrollToTop)

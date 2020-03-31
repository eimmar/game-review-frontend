import React from 'react'
import { withTranslation } from 'react-i18next'
import { BrowserRouter, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { PublicRoute } from './routes/PublicRoute'
import { Header } from './components/Header/Header'
import { routes } from './parameters'
import { lazyComponent } from './services/Util/PageSpeed'
import Registration from './views/User/Registration'
import Login from './views/User/Login'

const HomePage = lazyComponent(import('./views/HomePage'))

function App() {
    return (
        <BrowserRouter>
            <ToastContainer />
            <Header />
            <Switch>
                <PublicRoute exact path={routes.homePage} component={HomePage} />
                <PublicRoute exact path={routes.register} component={Registration} />
                <PublicRoute exact path={routes.login} component={Login} />
            </Switch>
        </BrowserRouter>
    )
}

export default withTranslation()(App)

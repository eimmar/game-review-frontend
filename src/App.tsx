import React from 'react'
import { withTranslation } from 'react-i18next'
import { BrowserRouter, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { PublicRoute } from './routes/PublicRoute'
import { routes } from './parameters'
import { lazyComponent } from './services/Util/PageSpeed'
import Registration from './views/User/Registration'
import Login from './views/User/Login'
import ForgotPassword from './views/User/ForgotPassword'
import ResetPassword from './views/User/ResetPassword'
import NotFound404 from './views/Error/NotFound404'
import GameList from './views/Game/GameList'
import GameView from './views/Game/GameView'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute'

const HomePage = lazyComponent(import('./views/HomePage'))

function App() {
    return (
        <BrowserRouter>
            <ToastContainer />
            <Switch>
                <PublicOnlyRoute exact path={routes.register} component={Registration} />
                <PublicOnlyRoute exact path={routes.login} component={Login} />
                <PublicOnlyRoute exact path={routes.forgotPassword} component={ForgotPassword} />
                <PublicOnlyRoute exact path={`${routes.resetPassword}/:guid`} component={ResetPassword} />

                <PublicRoute exact path={routes.homePage} component={HomePage} />

                <PublicRoute exact path={`${routes.game.list}`} component={GameList} />
                <PublicRoute exact path={`${routes.game.view}/:guid`} component={GameView} />

                <PublicRoute component={NotFound404} />
            </Switch>
        </BrowserRouter>
    )
}

export default withTranslation()(App)

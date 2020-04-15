import React from 'react'
import { withTranslation } from 'react-i18next'
import { Switch, Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'moment/locale/lt'

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
import history from './services/History'
import { PrivateRoute } from './routes/PrivateRoute'
import Profile from './views/User/Profile'
import UserView from './views/User/UserView'
import UserList from './views/User/UserList'
import ProfileEdit from './views/User/ProfileEdit'
import ChangePassword from './views/User/ChangePassword'

const HomePage = lazyComponent(import('./views/HomePage'))

function App() {
    return (
        <Router history={history}>
            <ToastContainer />
            <Switch>
                <PublicOnlyRoute exact path={routes.register} component={Registration} />
                <PublicOnlyRoute exact path={routes.login} component={Login} />
                <PublicOnlyRoute exact path={routes.forgotPassword} component={ForgotPassword} />
                <PublicOnlyRoute exact path={`${routes.resetPassword}/:token`} component={ResetPassword} />

                <PublicRoute exact path={routes.homePage} component={HomePage} />

                <PublicRoute exact path={`${routes.game.list}`} component={GameList} />
                <PublicRoute exact path={`${routes.game.view}/:guid`} component={GameView} />

                <PrivateRoute exact path={`${routes.user.profile}`} component={Profile} />
                <PrivateRoute exact path={`${routes.user.profileEdit}`} component={ProfileEdit} />
                <PrivateRoute exact path={`${routes.user.changePassword}`} component={ChangePassword} />
                <PublicRoute exact path={`${routes.user.view}/:guid`} component={UserView} />
                <PublicRoute exact path={routes.user.list} component={UserList} />

                <PublicRoute component={NotFound404} />
            </Switch>
        </Router>
    )
}

export default withTranslation()(App)

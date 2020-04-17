import React from 'react'
import { withTranslation } from 'react-i18next'
import { Switch, Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'moment/locale/lt'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import { PublicRoute } from './routes/PublicRoute'
import { routes } from './parameters'
import { lazyComponent } from './services/Util/PageSpeed'
import Registration from './views/Auth/Registration'
import Login from './views/Auth/Login'
import ForgotPassword from './views/Auth/ForgotPassword'
import ResetPassword from './views/Auth/ResetPassword'
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
import ChangePassword from './views/Auth/ChangePassword'
import GameListView from './views/GameList/GameListView'
import LogOut from './views/Auth/LogOut'

const HomePage = lazyComponent(import('./views/HomePage'))

function App() {
    const theme = createMuiTheme({
        palette: {
            type: 'dark',
            primary: { light: '#3ea6ff', main: '#3ea6ff', dark: '#3ea6ff', contrastText: '#030303' },
            secondary: { light: '#7045af', main: '#7045af', dark: '#7045af', contrastText: '#fff' },
            error: { light: '#c00', main: '#c00', dark: '#c00', contrastText: '' },
            info: { light: '#927fbf', main: '#927fbf', dark: '#927fbf' },
            success: { light: '#2ba640', main: '#2ba640', dark: '#2ba640' },
            background: { default: '#181818', paper: '#212121' },
        },
    })

    return (
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <ToastContainer />
                <Switch>
                    <PublicOnlyRoute exact path={routes.register} component={Registration} />
                    <PublicOnlyRoute exact path={routes.login} component={Login} />
                    <PublicOnlyRoute exact path={routes.forgotPassword} component={ForgotPassword} />
                    <PublicOnlyRoute exact path={`${routes.resetPassword}/:token`} component={ResetPassword} />
                    <PrivateRoute exact path={`${routes.logout}`} component={LogOut} />

                    <PublicRoute exact path={routes.homePage} component={HomePage} />

                    <PublicRoute exact path={`${routes.game.list}`} component={GameList} />
                    <PublicRoute exact path={`${routes.game.view}/:guid`} component={GameView} />

                    <PublicRoute exact path={`${routes.gameList.view}/:guid`} component={GameListView} />

                    <PrivateRoute exact path={`${routes.user.profile}`} component={Profile} />
                    <PrivateRoute exact path={`${routes.user.profileEdit}`} component={ProfileEdit} />
                    <PrivateRoute exact path={`${routes.user.changePassword}`} component={ChangePassword} />
                    <PublicRoute exact path={`${routes.user.view}/:guid`} component={UserView} />
                    <PublicRoute exact path={routes.user.list} component={UserList} />

                    <PublicRoute component={NotFound404} />
                </Switch>
            </Router>
        </ThemeProvider>
    )
}

export default withTranslation()(App)

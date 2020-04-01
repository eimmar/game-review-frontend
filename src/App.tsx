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

const HomePage = lazyComponent(import('./views/HomePage'))

function App() {
    return (
        <BrowserRouter>
            <ToastContainer />
            <Switch>
                <PublicRoute exact path={routes.homePage} component={HomePage} />
                <PublicRoute exact path={routes.register} component={Registration} />
                <PublicRoute exact path={routes.login} component={Login} />
                <PublicRoute exact path={routes.forgotPassword} component={ForgotPassword} />
                <PublicRoute exact path={`${routes.resetPassword}/:guid`} component={ResetPassword} />

                <PublicRoute component={NotFound404} />
            </Switch>
        </BrowserRouter>
    )
}

export default withTranslation()(App)

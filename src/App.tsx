import React from 'react';
import { withTranslation } from 'react-i18next';
import { BrowserRouter, Switch } from 'react-router-dom';

import { PublicRoute } from './routes/PublicRoute';
import { Header } from './components/Header/Header';
import { routes } from './parameters';
import { lazyComponent } from './services/Util/PageSpeed';

const HomePage = lazyComponent(import('./views/HomePage'));

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Switch>
                <PublicRoute exact path={routes.homePage} component={HomePage} />
            </Switch>
        </BrowserRouter>
    );
}

export default withTranslation()(App);

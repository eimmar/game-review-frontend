import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import { Route, Switch, withRouter } from 'react-router-dom';
import Callback from "./Callback";
import PublicResources from "./publicResources";

import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
} from '@elastic/eui';
import ReviewList from "./Review/List";
import View from "./Review/View";
import Form from "./Review/Form";
import VehicleList from "./Vehicle/List";


class Home extends Component {

    render() {
        return (
            <>
                <NavBar />
                <EuiPage className={"main-container"}>
                    <EuiPageBody>
                        <EuiPageContent>
                            <Switch>
                                <Route exact path={"/callback"} component={Callback} />
                                <Route exact path={"/reviews"} component={ReviewList} />
                                {/*<Route exact path={"/reviews/new"} component={Form} />*/}
                                <Route exact path={"/reviews/:id"} component={View} />
                                <Route exact path={"/reviews/:id//edit"} component={Form} />
                                <Route exact path={"/vehicles"} component={VehicleList} />
                                <Route exact path={"/vehicles/new"} component={Form} />
                                <Route exact path={"/vehicles/:id/:slug"} component={View} />
                                <Route exact path={"/vehicles/:id/:slug/edit"} component={Form} />
                                <Route path={"/"} component={PublicResources} />
                            </Switch>
                        </EuiPageContent>
                    </EuiPageBody>
                </EuiPage>
            </>
        )
    }
}

export default withRouter(Home);

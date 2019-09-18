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
import ReviewView from "./Review/View";
import ReviewForm from "./Review/Form";
import VehicleList from "./Vehicle/List";
import VehicleForm from "./Vehicle/Form";
import VehicleView from "./Vehicle/View";


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
                                <Route exact path={"/reviews/new"} render={props => <ReviewForm {...props} app={this}/>}/>
                                <Route exact path={"/reviews/:id"} component={ReviewView} />
                                <Route exact path={"/reviews/:id//edit"} component={ReviewForm} />
                                <Route exact path={"/vehicles"} component={VehicleList} />
                                <Route exact path={"/vehicles/new"} component={VehicleForm} />
                                <Route exact path={"/vehicles/:id/:slug"} component={VehicleView} />
                                <Route exact path={"/vehicles/:id/:slug/edit"} component={VehicleForm} />
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

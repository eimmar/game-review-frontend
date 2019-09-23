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
import ReviewReportForm from "./ReviewReport/Form";
import ReviewReportView from "./ReviewReport/View";
import ReviewReportList from "./ReviewReport/List";
import Footer from "./Footer";
import UserForm from "./User/UserForm";
import AuthService from "../services/authService";


class Home extends Component {

    render() {
        let isLoggedIn = AuthService.getCurrentUser();
        let isUser = AuthService.isUser();
        let isAdmin = AuthService.isAdmin();

        return (
            <>
                <NavBar />
                <EuiPage className={"main-container"}>
                    <EuiPageBody>
                        <EuiPageContent>
                            <Switch>
                                {!isLoggedIn && <Route path={"/login"} render={props => <UserForm {...props} isRegister={false}/>} />}
                                {!isLoggedIn && <Route path={"/register"} render={props => <UserForm {...props} isRegister={true}/>} />}


                                {isUser && <Route exact path={"/reviews/new"} render={props => <ReviewForm {...props} app={this}/>}/>}
                                {isUser && <Route exact path={"/reviews-reports/new"} component={ReviewReportForm} />}


                                {isAdmin && <Route exact path={"/reviews/:id/edit"} component={ReviewForm} />}
                                {isAdmin && <Route exact path={"/vehicles/new"} component={VehicleForm} />}
                                {isAdmin && <Route exact path={"/vehicles/:id/:slug/edit"} component={VehicleForm} />}
                                {isAdmin && <Route exact path={"/reviews-reports"} component={ReviewReportList} />}
                                {isAdmin && <Route exact path={"/reviews-reports/:id"} component={ReviewReportView} />}
                                {isAdmin && <Route exact path={"/reviews-reports/:id/edit"} component={ReviewReportForm} />}

                                <Route exact path={"/reviews"} component={ReviewList} />
                                <Route exact path={"/reviews/:id"} component={ReviewView} />
                                <Route exact path={"/vehicles"} component={VehicleList} />
                                <Route exact path={"/vehicles/:id/:slug"} component={VehicleView} />

                                <Route path={"/"} component={PublicResources} />
                            </Switch>
                        </EuiPageContent>
                    </EuiPageBody>
                    <Footer/>
                </EuiPage>
            </>
        )
    }
}

export default withRouter(Home);

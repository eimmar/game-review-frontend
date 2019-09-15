import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import Callback from "./Callback";
import SecuredRoute from "./SecuredRoute";
import PrivateResources from "./privateResources";
import PublicResources from "./publicResources";

import VehicleList from "./Vehicle/List";
import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
} from '@elastic/eui';
import Form from "./Vehicle/Form";

// import auth0Client from '../utils/Auth';

class Home extends Component {

    // async componentDidMount() {
    //     if (this.props.location.pathname === '/callback') return;
    //     try {
    //         await auth0Client.silentAuth();
    //         this.forceUpdate();
    //     } catch (err) {
    //         if (err.error === 'login_required') return;
    //         console.log(err.error);
    //     }
    // }

    render() {
        return (
            <>
                <NavBar />
                <EuiPage className={"main-container"}>
                    <EuiPageBody>
                        <EuiPageContent>
                            <Switch>
                                <Route exact path={"/callback"} component={Callback} />
                                <Route exact path={"/vehicles"} component={VehicleList} />
                                <Route exact path={"/vehicles/new"} component={Form} />
                                {/*<SecuredRoute path={'/private'} component={PrivateResources}/>*/}
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

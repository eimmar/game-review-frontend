import VehicleList from "./List";
import Form from "./Form";
import View from "./View";
import React, {Component} from "react";
import {Route} from "react-router-dom";

class VehicleRoutes extends Component {

    render() {
        return (
            <>
                <Route exact path={"/vehicles"} component={VehicleList} />
                <Route exact path={"/vehicles/new"} component={Form} />
                <Route exact path={"/vehicles/:id/:slug"} component={View} />
                <Route exact path={"/vehicles/:id/:slug/edit"} component={Form} />
            </>
        );
    }
}
export default VehicleRoutes;
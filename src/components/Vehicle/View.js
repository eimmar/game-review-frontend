import React, {Component} from 'react';

import {EuiText} from '@elastic/eui';
import {Link} from "react-router-dom";
import VehicleService from "../../services/vehicleService";

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicle: []
        }
    }
    componentDidMount() {
        VehicleService.get(this.props.match.params.id).then(response => {
            this.setState({
                vehicle: response.data
            })
        })
    }

    render() {
        const vehicle = this.state.vehicle;
        return (
            <div>
                <EuiText grow={false}>
                    <Link to={"/vehicles"}>Back</Link>
                    <Link to={"/vehicles/" + vehicle.id + "/" + VehicleService.slugify(vehicle) + "/edit"}>Edit</Link>
                    <dl>
                        <dt>Brand</dt>
                        <dd>{vehicle.brand}</dd>

                        <dt>Model</dt>
                        <dd>{vehicle.model}</dd>

                        <dt>Year made</dt>
                        <dd>{vehicle.madeFrom}-{vehicle.madeTo}</dd>

                        <dt>Fuel type</dt>
                        <dd>{vehicle.fuelType}</dd>

                        <dt>Engine capacity</dt>
                        <dd>{(vehicle.engineCapacity / 1000).toFixed(1)} l.</dd>

                        <dt>Power</dt>
                        <dd>{vehicle.power} kW</dd>
                    </dl>
                </EuiText>
            </div>
        );
    }
}
export default View;

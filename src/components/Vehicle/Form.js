import React, { Component } from 'react';

import {
    EuiButton,
    EuiFieldNumber,
    EuiForm,
    EuiFormRow,
    EuiSelect,
    EuiSpacer,
    EuiCallOut
} from '@elastic/eui';
import BrandService from "../../services/brandService";
import ModelService from "../../services/modelService";
import {Link} from "react-router-dom";
import VehicleService from "../../services/vehicleService";


class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSwitchChecked: false,
            brands: [],
            models: [],
            minYearTo: 1900,
            formError: '',
            submitting: false,
            vehicle: {
                id: '',
                brand: '',
                model: '',
                madeFrom: 1900,
                madeTo: 1900,
                fuelType: '',
                engineCapacity: 0,
                power: 0,
            }
        };

        this.fuelTypes = [
            {text: 'Petrol'},
            {text: 'Diesel'},
            {text: 'Electric'},
            {text: 'Hybrid'},
        ];

        this.onValueChange = this.onValueChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    onBrandChange = e => {
        ModelService.getAllByBrand(e.target.value).then(response => {
            this.setState({
                models: response.data.map(item => {
                    return {value: item.name, text: item.name};
                })
            });
        });

        let vehicle = this.state.vehicle;
        vehicle[e.target.name] = e.target.options[e.target.selectedIndex].text;
        this.setState({
            vehicle: vehicle
        })
    };

    onMadeFromChange = e => {
        this.setState({
            minYearTo: e.target.value
        });
        this.onValueChange(e);
    };


    onValueChange(e) {
        let vehicle = this.state.vehicle;
        vehicle[e.target.name] = e.target.value;
        this.setState({
            vehicle: vehicle
        })
    }


    componentDidMount() {
        if (this.props.match.params && this.props.match.params.id) {
            VehicleService.get(this.props.match.params.id).then(response => {
                this.setState({
                    vehicle: response.data
                })
            })
        }

        BrandService.getAll().then(response => {
            this.setState({
                brands: response.data.map(item => {
                    return {value: item.id, text: item.name};
                })
            });
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            submitting: true
        });
        let vehicle = this.state.vehicle;

        (vehicle.id ? VehicleService.update(vehicle.id, vehicle) : VehicleService.create(vehicle))
            .then((response) => {
                this.setState({
                    formSuccess: `Vehicle "${response.data.brand} ${response.data.model}" has been created!`,
                    formError: false
                });
            }).catch(e => {
            this.setState({
                formError: e.response.data,
                submitting: false
            });
        })
    }

    renderError() {
        return (<EuiCallOut title={this.state.formError} color="danger" iconType="alert"/>)
    }

    renderSuccess() {
        return (
            <EuiCallOut title={this.state.formSuccess} color="success" iconType="check">
                <Link to={"/vehicles"}>Back to list</Link>
            </EuiCallOut>
        )
    }

    render() {
        return (
            <EuiForm name={"vehicle"}>
                <Link to={"/vehicles"}>Back</Link>
                <form onSubmit={this.handleFormSubmit}>
                    {this.state.formError ? this.renderError() : ''}
                    {this.state.formSuccess ? this.renderSuccess() : ''}
                    <EuiFormRow label="Brand">
                        <EuiSelect name={"brand"}
                                   options={this.state.brands}
                                   hasNoInitialSelection={true}
                                   value={this.state.vehicle.brand}
                                   onChange={this.onBrandChange}/>
                    </EuiFormRow>

                    <EuiFormRow label="Model">
                        <EuiSelect name={"model"}
                                   value={this.state.vehicle.model}
                                   hasNoInitialSelection={true}
                                   onChange={this.onValueChange}
                                   options={this.state.models}/>
                    </EuiFormRow>

                    <EuiFormRow label="Made from year">
                        <EuiFieldNumber value={parseInt(this.state.vehicle.madeFrom)}
                                        name={"madeFrom"}
                                        min={1900}
                                        max={new Date().getFullYear()}
                                        onChange={this.onMadeFromChange}/>
                    </EuiFormRow>

                    <EuiFormRow label="Made to year">
                        <EuiFieldNumber value={parseInt(this.state.vehicle.madeTo, 10)}
                                        onChange={this.onValueChange}
                                        name={"madeTo"}
                                        min={parseInt(this.state.minYearTo, 10)}
                                        max={new Date().getFullYear()}/>
                    </EuiFormRow>

                    <EuiFormRow label="Fuel type">
                        <EuiSelect value={this.state.vehicle.fuelType}
                                   onChange={this.onValueChange}
                                   hasNoInitialSelection={true}
                                   name={"fuelType"}
                                   options={this.fuelTypes}/>
                    </EuiFormRow>

                    <EuiFormRow label="Engine capacity (ml.)">
                        <EuiFieldNumber value={parseInt(this.state.vehicle.engineCapacity, 10)}
                                        onChange={this.onValueChange}
                                        name={"engineCapacity"} min={0}/>
                    </EuiFormRow>

                    <EuiFormRow label="Power (kW)">
                        <EuiFieldNumber value={parseInt(this.state.vehicle.power, 10)}
                                        onChange={this.onValueChange}
                                        name={"power"} min={0}/>
                    </EuiFormRow>

                    <EuiSpacer />

                    <EuiButton type="submit" fill
                               isDisabled={this.state.submitting}>
                        Create
                    </EuiButton>
                </form>
            </EuiForm>
        );
    }
}
export default Form;

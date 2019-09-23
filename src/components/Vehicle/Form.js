import React, { Component } from 'react';

import {
    EuiButton,
    EuiFieldNumber,
    EuiForm,
    EuiFormRow,
    EuiSelect,
    EuiSpacer,
    EuiCallOut, EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner, EuiText
} from '@elastic/eui';
import {Link} from "react-router-dom";
import VehicleService from "../../services/vehicleService";


class VehicleForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSwitchChecked: false,
            brands: [],
            models: [],
            minYearTo: 1900,
            formError: '',
            submitting: false,
            isLoading: true,
            initialName: '',
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

        this.brands = {
            Audi: ['S4', 'S5', 'S6', 'RS7'],
            BMW: ['530D','535i','M5','M3'],
            'Mercedes-Benz': ['E350','E63 AMG','C63 AMG','CLK500'],
            Volvo: ['S60R','S90','V90','C30'],
            Honda: ['Civic Type R','Accord','NSX','CRV'],
            Toyota: ['Prius','Corolla','Avensis','Supra'],
        };


        this.onValueChange = this.onValueChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    onBrandChange = e => {
        this.onValueChange(e);
        this.setState({
            models: this.brands[this.state.vehicle.brand].map(item => {
                return {text: item}
            }),
        });
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
                    vehicle: response.data,
                    initialName: response.data.brand + ' ' + response.data.model
                })
            }).finally(() => {
                this.setState({
                    models: this.brands[this.state.vehicle.brand].map(item => {
                        return {text: item}
                    }),
                    isLoading: false
                });
            })
        } else {
            this.setState({
                isLoading: false
            });
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            submitting: true,
            isLoading: true
        });
        let vehicle = this.state.vehicle;

        (vehicle.id ? VehicleService.update(vehicle.id, vehicle) : VehicleService.create(vehicle))
            .then(() => {
                this.setState({
                    formSuccess: `Vehicle "${this.state.initialName}" has been ${vehicle.id ? 'updated' : 'created'}!`,
                    formError: false,
                    submitting: !vehicle.id

                });
            }).catch(e => {
            this.setState({
                formError: e.response ? e.response.data.message : "Access denied.",
                submitting: false,
            });
        });

        this.setState({
            isLoading: false
        });
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
            <>
                {this.state.isLoading ? <EuiLoadingSpinner size="xl" /> : <EuiForm name={"vehicle"}>
                    <EuiFlexGroup gutterSize="s" alignItems="center">
                        <EuiFlexItem grow={false}>
                            <EuiButton onClick={() => this.props.history.push('/vehicles')}>
                                Back
                            </EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                    <EuiSpacer />


                    <form onSubmit={this.handleFormSubmit}>
                        {this.state.formError ? this.renderError() : ''}
                        {this.state.formSuccess ? this.renderSuccess() : ''}
                        <EuiText>
                            <h2>
                                {this.state.vehicle.id ? `Update ${this.state.initialName}` : 'Create Vehicle'}
                            </h2>
                        </EuiText>
                        <EuiFormRow label="Brand">
                            <EuiSelect name={"brand"}
                                       options={Object.keys(this.brands).map(item => {
                                           return {text: item}
                                       })}
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
                            {this.state.vehicle.id ? 'Update' : 'Create'}
                        </EuiButton>
                    </form>
                </EuiForm>}
            </>
        );
    }
}
export default VehicleForm;

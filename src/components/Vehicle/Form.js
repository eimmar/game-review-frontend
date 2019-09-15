import React, { Component } from 'react';

import {
    EuiButton,
    EuiFieldNumber,
    EuiForm,
    EuiFormRow,
    EuiSelect,
    EuiSpacer,
} from '@elastic/eui';
import BrandService from "../../services/brandService";
import ModelService from "../../services/modelService";
import {Link} from "react-router-dom";


class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSwitchChecked: false,
            brands: [],
            models: [],
            minYearTo: 1900
        };

        this.fuelTypes = [
            {text: 'Petrol'},
            {text: 'Diesel'},
            {text: 'Electric'},
            {text: 'Hybrid'},
        ]
    }

    onBrandChange = e => {
        ModelService.getAllByBrand(e.target.value).then(response => {
            this.setState({
                models: response.data.map(item => {
                    return {value: item.id, text: item.name};
                })
            });
        });
    };

    onMadeFromChange = e => {
        this.setState({
            minYearTo: e.target.value
        })
    };

    componentDidMount() {
        BrandService.getAll().then(response => {
            this.setState({
                brands: response.data.map(item => {
                    return {value: item.id, text: item.name};
                })
            });
        });

        ModelService.getAllByBrand(1).then(response => {
            this.setState({
                models: response.data.map(item => {
                    return {value: item.id, text: item.name};
                })
            });
        });
    }

    render() {
        return (
            <EuiForm name={"vehicle"}>
                <Link to={"/vehicles"}>Back</Link>
                <EuiFormRow label="Brand">
                    <EuiSelect name={"vehicle[brand]"} options={this.state.brands} onChange={this.onBrandChange}/>
                </EuiFormRow>

                <EuiFormRow label="Model">
                    <EuiSelect name={"vehicle[model]"} options={this.state.models}/>
                </EuiFormRow>

                <EuiFormRow label="Made from year">
                    <EuiFieldNumber name={"vehicle[yearFrom]"} min={1900} max={new Date().getFullYear()} onChange={this.onMadeFromChange}/>
                </EuiFormRow>

                <EuiFormRow label="Made to year">
                    <EuiFieldNumber name={"vehicle[yearTo]"} min={this.state.minYearTo} max={new Date().getFullYear()}/>
                </EuiFormRow>

                <EuiFormRow label="Fuel type">
                    <EuiSelect name={"vehicle[fuelType]"} options={this.fuelTypes}/>
                </EuiFormRow>

                <EuiFormRow label="Engine capacity (ml.)">
                    <EuiFieldNumber name={"vehicle[engineCapacity]"} min={0}/>
                </EuiFormRow>

                <EuiFormRow label="Power (kW)">
                    <EuiFieldNumber name={"vehicle[power]"} min={0}/>
                </EuiFormRow>

                <EuiSpacer />

                <EuiButton type="submit" fill>
                    Create
                </EuiButton>
            </EuiForm>
        );
    }
}
export default Form;

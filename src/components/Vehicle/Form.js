import React, { Component } from 'react';

import {
    EuiButton,
    EuiFieldNumber,
    EuiFieldText,
    EuiForm,
    EuiFormRow,
    EuiRange,
    EuiSelect,
    EuiSpacer,
    EuiSwitch,
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
    }

    onSwitchChange = () => {
        this.setState({
            isSwitchChecked: !this.state.isSwitchChecked,
        });
    };

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
            <EuiForm>
                <Link to={"/vehicles"}>Back</Link>
                <EuiFormRow label="Brand">
                    <EuiSelect options={this.state.brands} onChange={this.onBrandChange}/>
                </EuiFormRow>

                <EuiFormRow label="Model">
                    <EuiSelect options={this.state.models}/>
                </EuiFormRow>

                <EuiFormRow label="Made from year">
                    <EuiFieldNumber min={1900} max={new Date().getFullYear()} onChange={this.onMadeFromChange}/>
                </EuiFormRow>

                <EuiFormRow label="Made to year">
                    <EuiFieldNumber min={this.state.minYearTo} max={new Date().getFullYear()}/>
                </EuiFormRow>

                <EuiFormRow label="Fuel type">
                    <EuiSelect options={this.state.models}/>
                </EuiFormRow>

                <EuiFormRow label="Engine capacity (ml.)">
                    <EuiFieldNumber min={0}/>
                </EuiFormRow>

                <EuiFormRow label="Power (kW)">
                    <EuiFieldNumber min={0}/>
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

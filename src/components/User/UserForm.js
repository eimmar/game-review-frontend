import React, { Component } from 'react';

import {
    EuiButton,
    EuiForm,
    EuiFormRow,
    EuiSpacer,
    EuiCallOut, EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner, EuiText, EuiFieldPassword, EuiFieldText
} from '@elastic/eui';
import {Link} from "react-router-dom";
import AuthService from "../../services/authService";

class UserForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formError: '',
            submitting: false,
            isLoading: false,
            user: {
                username: '',
                email: '',
                password: ''
            }
        };

        this.onValueChange = this.onValueChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }


    onValueChange(e) {
        let user = this.state.user;
        user[e.target.name] = e.target.value;
        this.setState({
            user: user
        })
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            submitting: true,
            isLoading: true
        });
        let user = this.state.user;
        (this.props.isRegister ? AuthService.register(user) : AuthService.login(user))
            .then(() => {
                this.setState({
                    formSuccess: `${this.props.isRegister ? 'Registration' : 'Login'} has been successful!`,
                    formError: false,
                    submitting: true

                });
            }).catch((error) => {
            this.setState({
                formError: error.response ? error.response.data.message : 'Could not ' + (this.props.isRegister ? `register` : 'login'),
                submitting: false,
            });
        }).finally(() => {
            this.setState({
                isLoading: false
            });
            if (this.state.formSuccess) {
                this.props.history.push({
                    pathname: "/",
                    state: {success: this.state.formSuccess}
                })
            }
        });
    }

    getBackUrl() {
        return `/`;
    }

    renderError() {
        return (<EuiCallOut title={this.state.formError} color="danger" iconType="alert"/>)
    }

    renderSuccess() {
        return (
            <EuiCallOut title={this.state.formSuccess} color="success" iconType="check">
                <Link to={this.getBackUrl()}>Back to Home page</Link>
            </EuiCallOut>
        )
    }

    render() {

        return (
            <>
                <EuiForm name={"user"}>
                    <EuiFlexGroup gutterSize="s" alignItems="center">
                        <EuiFlexItem grow={false}>
                            <EuiButton onClick={() => this.props.history.push(this.getBackUrl())}>
                                Back
                            </EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                    <EuiSpacer />

                    {this.state.formError ? this.renderError() : ''}
                    {this.state.formSuccess ? this.renderSuccess() : ''}
                    {this.state.isLoading ? <EuiLoadingSpinner size="xl" /> :<form onSubmit={this.handleFormSubmit}>
                        <EuiText>
                            <h2>
                                {this.props.isRegister ? 'Register' : 'Login'}
                            </h2>
                        </EuiText>

                        <EuiFormRow label="Username">
                            <EuiFieldText name={"username"}
                                         placeholder="Username"
                                         value={this.state.user.username}
                                         onChange={this.onValueChange}
                            />
                        </EuiFormRow>
                        {this.props.isRegister && <EuiFormRow label="Email">
                            <EuiFieldText name={"email"}
                                         placeholder="Email"
                                         value={this.state.user.email}
                                         onChange={this.onValueChange}
                            />
                        </EuiFormRow>}

                        <EuiFormRow label="Password">
                            <EuiFieldPassword name={"password"}
                                         value={this.state.user.password}
                                         onChange={this.onValueChange}
                            />
                        </EuiFormRow>

                        <EuiSpacer />
                        <EuiButton type="submit" fill
                                   isDisabled={this.state.submitting}>
                            {this.props.isRegister ? 'Register' : 'Login'}
                        </EuiButton>
                    </form>}
                </EuiForm>
            </>
        );
    }
}

export default UserForm;

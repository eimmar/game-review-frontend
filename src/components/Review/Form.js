import React, { Component } from 'react';

import {
    EuiButton,
    EuiFieldNumber,
    EuiForm,
    EuiFormRow,
    EuiSpacer,
    EuiCallOut, EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner, EuiText, EuiTextArea
} from '@elastic/eui';
import {Link} from "react-router-dom";
import ReviewService from "../../services/reviewService";
import VehicleService from "../../services/vehicleService";

class ReviewForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSwitchChecked: false,
            formError: '',
            submitting: false,
            isLoading: true,
            review: {
                id: '',
                vehicle: {},
                comment: '',
                rating: 1
            }
        };

        this.onValueChange = this.onValueChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }


    onValueChange(e) {
        let review = this.state.review;
        review[e.target.name] = e.target.value;
        this.setState({
            review: review
        })
    }

    componentDidMount() {
        if (this.props.match.params && this.props.match.params.id) {
            ReviewService.get(this.props.match.params.id).then(response => {
                this.setState({
                    review: response.data
                })
            }).finally(() => {
                this.setState({
                    isLoading: false
                });
            })
        } else if (this.state.review && this.props.location.state && this.props.location.state.vehicle) {
            let review = this.state.review;
            review.vehicle = this.props.location.state.vehicle;
            this.setState({
                review: review,
                isLoading: false
            })
        } else {
            this.setState({
                formError: 'Error. Please refresh the page.'
            })
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            submitting: true,
            isLoading: true
        });
        let review = this.state.review;
        (review.id ? ReviewService.update(review.id, review) : ReviewService.create(review))
            .then(() => {
                this.setState({
                    formSuccess: `Review has been ${review.id ? 'updated' : 'created'}!`,
                    formError: false,
                    submitting: !review.id

                });
            }).catch(e => {
            this.setState({
                formError: e.response ? e.response.data.message : 'Could not ' + (this.state.review.id ? `update review` : 'create review'),
                submitting: false,
            });
        });

        this.setState({
            isLoading: false
        });
    }

    getBackUrl() {
        return `/vehicles/${this.state.review.vehicle.id}/${VehicleService.slugify(this.state.review.vehicle)}`
    }

    renderError() {
        return (<EuiCallOut title={this.state.formError} color="danger" iconType="alert"/>)
    }

    renderSuccess() {
        return (
            <EuiCallOut title={this.state.formSuccess} color="success" iconType="check">
                <Link to={this.getBackUrl()}>Back to list</Link>
            </EuiCallOut>
        )
    }

    render() {

        return (
            <>
                <EuiForm name={"review"}>
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
                                {this.state.review.vehicle.brand + ' ' + this.state.review.vehicle.model}
                            </h2>
                            <h3>
                                {this.state.review.id ? `Update Review` : 'Create Review'}
                            </h3>
                        </EuiText>

                        <EuiFormRow label="Review">
                            <EuiTextArea name={"comment"}
                                         placeholder="Write a review"
                                         value={this.state.review.comment}
                                         onChange={this.onValueChange}
                            />
                        </EuiFormRow>

                        <EuiFormRow label="Rating">
                            <EuiFieldNumber value={parseInt(this.state.review.rating)}
                                            name={"rating"}
                                            min={1}
                                            max={5}
                                            onChange={this.onValueChange}/>
                        </EuiFormRow>
                        <EuiSpacer />
                        <EuiButton type="submit" fill
                                   isDisabled={this.state.submitting}>
                            {this.state.review.id ? 'Update' : 'Create'}
                        </EuiButton>
                    </form>}
                </EuiForm>
            </>
        );
    }
}

export default ReviewForm;
